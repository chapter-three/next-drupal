<?php

namespace Drupal\next;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Logger\LoggerChannelInterface;
use Drupal\Core\Utility\Error;
use Drupal\next\Entity\NextSiteInterface;
use GuzzleHttp\ClientInterface;
use Symfony\Component\HttpFoundation\Response;

/**
 * Defines the path revalidator helper service.
 */
class PathRevalidatorHelper implements PathRevalidatorHelperInterface {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  private EntityTypeManagerInterface $entityTypeManager;

  /**
   * The next settings manager.
   *
   * @var \Drupal\next\NextSettingsManagerInterface
   */
  private NextSettingsManagerInterface $nextSettingsManager;

  /**
   * The http client.
   *
   * @var \GuzzleHttp\ClientInterface
   */
  private ClientInterface $httpClient;

  /**
   * The logger.
   *
   * @var \Drupal\Core\Logger\LoggerChannelInterface
   */
  private LoggerChannelInterface $logger;

  /**
   * Construct the PathRevalidatorHelper.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager service.
   * @param \Drupal\next\NextSettingsManagerInterface $next_settings_manager
   *   The next settings manager.
   * @param \GuzzleHttp\ClientInterface $http_client
   *   The http client.
   * @param \Drupal\Core\Logger\LoggerChannelInterface $logger
   *   The logger.
   */
  public function __construct(
    EntityTypeManagerInterface $entity_type_manager,
    NextSettingsManagerInterface $next_settings_manager,
    ClientInterface $http_client,
    LoggerChannelInterface $logger
  ) {
    $this->entityTypeManager = $entity_type_manager;
    $this->nextSettingsManager = $next_settings_manager;
    $this->httpClient = $http_client;
    $this->logger = $logger;
  }

  /**
   * {@inheritdoc}
   */
  public function revalidatePathByNodeIds(
    array $nids,
    string $langcode,
    NextSiteInterface $site,
    string $event_action
  ): void {
    /** @var \Drupal\node\NodeInterface[] $nodes */
    $nodes = $this->entityTypeManager->getStorage('node')->loadMultiple($nids);
    foreach ($nodes as $node) {
      $translation = $node->getTranslation($langcode);
      $path = $translation->toUrl()->toString();
      $this->revalidatePath($path, $site, $event_action);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function revalidatePath(
    string $path,
    NextSiteInterface $site,
    string $event_action
  ): void {
    try {
      $revalidate_url = $site->getRevalidateUrlForPath($path);

      if (!$revalidate_url) {
        throw new \Exception('No revalidate url set.');
      }

      if ($this->nextSettingsManager->isDebug()) {
        $this->logger->notice('(@action): Revalidating path %path for the site %site. URL: %url', [
          '@action' => $event_action,
          '%path' => $path,
          '%site' => $site->label(),
          '%url' => $revalidate_url->toString(),
        ]);
      }

      $response = $this->httpClient->request('GET', $revalidate_url->toString());
      if ($response && $response->getStatusCode() === Response::HTTP_OK) {
        if ($this->nextSettingsManager->isDebug()) {
          $this->logger->notice('(@action): Successfully revalidated path %path for the site %site. URL: %url', [
            '@action' => $event_action,
            '%path' => $path,
            '%site' => $site->label(),
            '%url' => $revalidate_url->toString(),
          ]);
        }
      }
    }
    catch (\Exception $exception) {
      Error::logException($this->logger, $exception);
    }
  }

}
