<?php

namespace Drupal\next_extras;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Logger\LoggerChannelInterface;
use Drupal\Core\Url;
use Drupal\next\Entity\NextSiteInterface;
use Drupal\next\NextEntityTypeManagerInterface;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

/**
 * Invalidates Next.js ISR caches.
 */
class NextCacheInvalidator {

  /**
   * Next entity type manager service.
   *
   * @var \Drupal\next\NextEntityTypeManagerInterface
   */
  private NextEntityTypeManagerInterface $nextEntityTypeManager;

  /**
   * HTTP client service.
   *
   * @var \GuzzleHttp\Client
   */
  private Client $httpClient;

  /**
   * Logger channel.
   *
   * @var \Drupal\Core\Logger\LoggerChannelInterface
   */
  private LoggerChannelInterface $logger;

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
   * Invalidates an entity.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity to invalidate.
   *
   * @throws \Drupal\Core\Entity\EntityMalformedException
   */
  public function invalidateEntity(EntityInterface $entity): void {
    $next_entity_type_config = $this->nextEntityTypeManager->getConfigForEntityType($entity->getEntityTypeId(), $entity->bundle());
    if (!$next_entity_type_config) {
      return;
    }

    $revalidate = (bool) $next_entity_type_config->getThirdPartySetting('next_extras', 'revalidate');
    if (!$revalidate) {
      return;
    }

    // Find Next.js sites for entity.
    $sites = $next_entity_type_config->getSiteResolver()->getSitesForEntity($entity);
    if (!count($sites)) {
      return;
    }

    // Revalidate entity.
    $slug = $entity->toUrl()->toString();
    $this->invalidatePath($slug, $sites);
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

        $this->httpClient->get($revalidate_url);
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
