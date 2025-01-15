<?php

namespace Drupal\next\Plugin\Next\Revalidator;

use Drupal\Core\Entity\FieldableEntityInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;
use Drupal\Core\Utility\Error;
use Drupal\next\Entity\NextSite;
use Drupal\next\Event\EntityActionEvent;
use Drupal\next\Plugin\ConfigurableRevalidatorBase;
use Drupal\next\Plugin\RevalidatorInterface;
use Symfony\Component\HttpFoundation\Response;

/**
 * Provides a revalidator for revalidating Next Site references by cache tags.
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

    $tags = [];
    $tags[] = $entity->getEntityTypeId() . ':' . $entity->id();
    if ($entity->getEntityTypeId() == 'menu_link_content') {
      $tags[] = $entity->getEntityTypeId() . ':' . $entity->getMenuName();
    }
    else {
      $tags[] = $entity->getEntityTypeId() . '_list';
      $tags[] = $entity->getEntityTypeId() . '_list:' . $entity->bundle();
    }

    /** @var \Drupal\next\Entity\NextSite $site */
    foreach ($sites as $site) {
      try {
        $tags_string = implode(',', $tags);
        $revalidate_url = $this->getRevalidateUrlForTags($site, $tags_string);

        if (!$revalidate_url) {
          throw new \Exception('No revalidate url set.');
        }

        if ($this->nextSettingsManager->isDebug()) {
          $this->logger->notice('(@action): Revalidating tags %tags for the site %site. URL: %url', [
            '@action' => $event->getAction(),
            '%tags' => $tags_string,
            '%site' => $site->label(),
            '%url' => $revalidate_url->toString(),
          ]);
        }

        $response = $this->httpClient->request('GET', $revalidate_url->toString());
        if ($response && $response->getStatusCode() === Response::HTTP_OK) {
          if ($this->nextSettingsManager->isDebug()) {
            $this->logger->notice('(@action): Successfully revalidated tags %path for the site %site. URL: %url', [
              '@action' => $event->getAction(),
              '%tags' => $tags_string,
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

  /**
   * Returns the revalidate url for given cache tags.
   *
   * @param NextSite $site
   * @param string $cache_tags
   *   The cache tags as string.
   *
   * @return \Drupal\Core\Url|null
   *   The revalidate url.
   */
  protected function getRevalidateUrlForTags(NextSite $site, string $cache_tags): ?Url {
    $revalidate_url = $site->getRevalidateUrl();
    if (!$revalidate_url) {
      return NULL;
    }
    $query = [
      'tags' => $cache_tags,
    ];
    if ($secret = $site->getRevalidateSecret()) {
      $query['secret'] = $secret;
    }
    return Url::fromUri($site->getRevalidateUrl(), [
      'query' => $query,
    ]);
  }

}
