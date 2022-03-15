<?php

namespace Drupal\next_extras;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Logger\LoggerChannelInterface;
use Drupal\Core\Url;
use Drupal\next\Entity\NextSiteInterface;
use Drupal\next\NextEntityTypeManagerInterface;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Symfony\Component\HttpFoundation\Response;

/**
 * Invalidates Next.js ISR caches.
 */
class NextCacheInvalidator {

  /**
   * Next entity type manager service.
   *
   * @var \Drupal\next\NextEntityTypeManagerInterface
   */
  protected NextEntityTypeManagerInterface $nextEntityTypeManager;

  /**
   * HTTP client service.
   *
   * @var \GuzzleHttp\Client
   */
  protected Client $httpClient;

  /**
   * Logger channel.
   *
   * @var \Drupal\Core\Logger\LoggerChannelInterface
   */
  protected LoggerChannelInterface $logger;

  /**
   * NextCacheInvalidator constructor.
   *
   * @param \Drupal\next\NextEntityTypeManagerInterface $nextEntityTypeManager
   *   Next entity type manager service.
   * @param \GuzzleHttp\Client $httpClient
   *   HTTP client service.
   * @param \Drupal\Core\Logger\LoggerChannelInterface $logger
   *   Logger channel.
   */
  public function __construct(NextEntityTypeManagerInterface $nextEntityTypeManager, Client $httpClient, LoggerChannelInterface $logger) {
    $this->nextEntityTypeManager = $nextEntityTypeManager;
    $this->httpClient = $httpClient;
    $this->logger = $logger;
  }

  /**
   * Returns an array of sites to invalidate for given entity.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity to retrieve sites for.
   *
   * @return \Drupal\next\Entity\NextSiteInterface[]
   *   An array of next sites.
   */
  public function getSitesToInvalidate(EntityInterface $entity): array {
    $next_entity_type_config = $this->nextEntityTypeManager->getConfigForEntityType($entity->getEntityTypeId(), $entity->bundle());
    if (!$next_entity_type_config) {
      return [];
    }

    $revalidate = (bool) $next_entity_type_config->getThirdPartySetting('next_extras', 'revalidate');
    if (!$revalidate) {
      return [];
    }

    return $next_entity_type_config->getSiteResolver()->getSitesForEntity($entity);
  }

  /**
   * Returns an array of paths to invalidate for given entity.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity to retrieve paths for.
   *
   * @return string[]
   *   An array of paths.
   */
  public function getPathsToInvalidate(EntityInterface $entity): array {
    $next_entity_type_config = $this->nextEntityTypeManager->getConfigForEntityType($entity->getEntityTypeId(), $entity->bundle());
    if (!$next_entity_type_config) {
      return [];
    }

    $paths = [$entity->toUrl()->toString()];

    $revalidate_paths = $next_entity_type_config->getThirdPartySetting('next_extras', 'revalidate_paths');

    if ($revalidate_paths) {
      $paths = array_merge($paths, array_map('trim', explode("\n", $revalidate_paths)));
    }

    return $paths;
  }

  /**
   * Invalidates an entity.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity to invalidate.
   *
   * @throws \Drupal\Core\Entity\EntityMalformedException
   */
  public function invalidateEntity(EntityInterface $entity): void {
    $sites = $this->getSitesToInvalidate($entity);
    if (!count($sites)) {
      return;
    }

    $this->invalidatePath($entity->toUrl()->toString(), $sites);
  }

  /**
   * Invalidates a path.
   *
   * @param string $path
   *   The path.
   * @param \Drupal\next\Entity\NextSiteInterface[] $sites
   *   The site for which to revalidate.
   */
  public function invalidatePath(string $path, array $sites): void {
    foreach ($sites as $site) {
      $revalidate_url = static::buildUrl($site, $path);
      try {
        $this->logger->notice('Revalidating page at %url', [
          '%url' => $revalidate_url,
        ]);

        $response = $this->httpClient->get($revalidate_url);
        if ($response->getStatusCode() === Response::HTTP_OK) {
          $this->logger->notice('Successfully revalidated page at %url', [
            '%url' => $revalidate_url,
          ]);
        }
      }
      catch (RequestException $exception) {
        watchdog_exception('next_extras', $exception);
      }
    }
  }

  /**
   * Builds the invalidation request URL.
   *
   * @param \Drupal\next\Entity\NextSiteInterface $site
   *   The Next site.
   * @param string $path
   *   The path.
   *
   * @return string
   *   Built URL.
   */
  protected static function buildUrl(NextSiteInterface $site, string $path): string {
    // @todo Make this path configurable.
    return Url::fromUri("{$site->getBaseUrl()}/api/revalidate", [
      'query' => [
        'secret' => $site->getPreviewSecret(),
        'slug' => $path,
      ],
    ])->toString();
  }

}
