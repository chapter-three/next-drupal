<?php

namespace Drupal\next\Plugin\Next\Revalidator;

use Drupal\Core\Entity\FieldableEntityInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Utility\Error;
use Drupal\next\Event\EntityActionEvent;
use Drupal\next\Plugin\ConfigurableRevalidatorBase;
use Drupal\next\Plugin\RevalidatorInterface;
use Symfony\Component\HttpFoundation\Response;

/**
 * Cache tag based on-demand revalidation plugin.
 *
 * @Revalidator(
 *  id = "cache_tag",
 *  label = "Cache Tag",
 *  description = "Cache tag based on-demand revalidation."
 * )
 */
class CacheTag extends ConfigurableRevalidatorBase implements RevalidatorInterface {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
    // No configuration form.
  }

  /**
   * {@inheritdoc}
   * @throws \Drupal\Core\Entity\EntityMalformedException
   * @throws \GuzzleHttp\Exception\GuzzleException
   */
  public function revalidate(EntityActionEvent $event): bool {
    $revalidated = FALSE;
    $entity = $event->getEntity();
    $sites = $event->getSites();

    if (!($entity instanceof FieldableEntityInterface)) {
      return FALSE;
    }

    // Get all available cache tags (including list tags).
    $list_tags = $entity->getEntityType()->getListCacheTags();
    if ($entity->getEntityType()->hasKey('bundle')) {
      $list_tags[] = $entity->getEntityTypeId() . '_list:' . $entity->bundle();
    }
    $combined_tags = array_merge($entity->getCacheTags(), $list_tags);
    $cache_tags = implode(',', $combined_tags);

    /** @var \Drupal\next\Entity\NextSite $site */
    foreach ($sites as $site) {
      try {
        $revalidate_url = $site->buildRevalidateUrl(['tags' => $cache_tags]);
        if (!$revalidate_url) {
          throw new \Exception('No revalidate url set.');
        }

        if ($this->nextSettingsManager->isDebug()) {
          $this->logger->notice('(@action): Revalidating tags %list for the site %site. URL: %url', [
            '@action' => $event->getAction(),
            '%list' => $cache_tags,
            '%site' => $site->label(),
            '%url' => $revalidate_url->toString(),
          ]);
        }

        $response = $this->httpClient->request('GET', $revalidate_url->toString());
        if ($response && $response->getStatusCode() === Response::HTTP_OK) {
          if ($this->nextSettingsManager->isDebug()) {
            $this->logger->notice('(@action): Successfully revalidated tags %list for the site %site. URL: %url', [
              '@action' => $event->getAction(),
              '%list' => $cache_tags,
              '%site' => $site->label(),
              '%url' => $revalidate_url->toString(),
            ]);
          }

          $revalidated = TRUE;
        }
      }
      catch (\Exception $exception) {
        Error::logException($this->logger, $exception);
        $revalidated = FALSE;
      }
    }

    return $revalidated;
  }

}
