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
    return [
      'entity_tag' => TRUE,
      'entity_list_tag' => TRUE,
      'additional_tags' => NULL,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    // Get entity type and bundle from form callback object.
    $entity_type_id = NULL;
    $bundle = NULL;

    try {
      $entity_bundle_string = $form_state->getBuildInfo()['callback_object']->getEntity()->id();
      // Split "node.quote" into entity type and bundle.
      if (strpos($entity_bundle_string, '.') !== FALSE) {
        [$entity_type_id, $bundle] = explode('.', $entity_bundle_string, 2);
      }
    }
    catch (\Exception $exception) {
      // Fallback if we can't get the entity info.
      Error::logException($this->logger, $exception);
      $entity_type_id = NULL;
      $bundle = NULL;
    }

    $form['entity_tag'] = [
      '#title' => $this->t('Revalidate entity cache tag'),
      '#description' => $this->t('Revalidate pages with the individual entity cache tag (e.g., @entity_type:123).', [
        '@entity_type' => $entity_type_id ?: 'node',
      ]),
      '#type' => 'checkbox',
      '#default_value' => $this->configuration['entity_tag'] ?? TRUE,
    ];

    // Generate specific label and description based on detected entity type.
    if ($entity_type_id && $bundle) {
      if ($entity_type_id === 'node') {
        $list_tag_example = 'node_list:' . $bundle;
        $next_js_example = 'tags: ["node_list:' . $bundle . '"]';
      }
      elseif ($entity_type_id === 'taxonomy_term') {
        $list_tag_example = 'taxonomy_term_list:' . $bundle;
        $next_js_example = 'tags: ["taxonomy_term_list:' . $bundle . '"]';
      }
      else {
        $list_tag_example = $entity_type_id . '_list:' . $bundle;
        $next_js_example = 'tags: ["' . $entity_type_id . '_list:' . $bundle . '"]';
      }

      $title = $this->t('Revalidate @tag cache tags', ['@tag' => $list_tag_example]);
      $description = $this->t('Revalidates pages tagged with @tag when @entity_type entities of type @bundle change.<br><br>In Next.js use: <code>@example</code>', [
        '@tag' => $list_tag_example,
        '@entity_type' => $entity_type_id,
        '@bundle' => $bundle,
        '@example' => $next_js_example,
      ]);
    }
    else {
      $title = $this->t('Revalidate [entity_type]_list:[bundle] cache tags');
      $description = $this->t('Revalidates pages tagged with entity type and bundle list cache tags when entities change.<br><strong>Node entities:</strong> generates node_list:[bundle] (e.g., node_list:article, node_list:person)<br><strong>Taxonomy terms:</strong> generates taxonomy_term_list:[vocabulary] (e.g., taxonomy_term_list:tags)<br><strong>Other entities:</strong> generates [entity_type]_list:[bundle]<br><br>In Next.js use: <code>tags: ["node_list:article"]</code> or <code>tags: ["taxonomy_term_list:tags"]</code>');
    }

    $form['entity_list_tag'] = [
      '#title' => $title,
      '#description' => $description,
      '#type' => 'checkbox',
      '#default_value' => $this->configuration['entity_list_tag'] ?? TRUE,
    ];

    $form['additional_tags'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Additional cache tags to revalidate'),
      '#default_value' => $this->configuration['additional_tags'] ?? '',
      '#description' => $this->t('Additional cache tags to revalidate when this entity type changes. Enter one tag per line. Examples:<br>node_list:all<br>search_results<br>homepage'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateConfigurationForm(array &$form, FormStateInterface $form_state) {
    $additional_tags = $form_state->getValue('additional_tags');

    if (!empty($additional_tags)) {
      $tags = array_map('trim', explode("\n", $additional_tags));
      $tags = array_filter($tags);

      foreach ($tags as $tag) {
        // Validate that each tag is a string and doesn't contain invalid
        // characters.
        if (!is_string($tag) || empty($tag)) {
          $form_state->setErrorByName('additional_tags', $this->t('Each cache tag must be a non-empty string.'));
          break;
        }

        // Check for invalid characters (spaces, special characters that could
        // break cache tags).
        if (preg_match('/[^\w\-:._]/', $tag)) {
          $form_state->setErrorByName('additional_tags', $this->t('Cache tags can only contain letters, numbers, hyphens, colons, periods, and underscores. Invalid tag: @tag', [
            '@tag' => $tag,
          ]));
          break;
        }

        // Check for reasonable length limit.
        if (strlen($tag) > 255) {
          $form_state->setErrorByName('additional_tags', $this->t('Cache tags must be 255 characters or less. Invalid tag: @tag', [
            '@tag' => $tag,
          ]));
          break;
        }
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
    $this->configuration['entity_tag'] = $form_state->getValue('entity_tag');
    $this->configuration['entity_list_tag'] = $form_state->getValue('entity_list_tag');
    $this->configuration['additional_tags'] = $form_state->getValue('additional_tags');
  }

  /**
   * {@inheritdoc}
   *
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

    $cache_tags = [];

    // Add individual entity cache tags if enabled.
    if (!empty($this->configuration['entity_tag'])) {
      $cache_tags = array_merge($cache_tags, $entity->getCacheTags());
    }

    // Add entity list cache tags if enabled.
    if (!empty($this->configuration['entity_list_tag'])) {
      $list_tags = $entity->getEntityType()->getListCacheTags();
      if ($entity->getEntityType()->hasKey('bundle')) {
        $list_tags[] = $entity->getEntityTypeId() . '_list:' . $entity->bundle();
      }
      $cache_tags = array_merge($cache_tags, $list_tags);
    }

    // Add additional cache tags.
    if (!empty($this->configuration['additional_tags'])) {
      $additional_tags = array_map('trim', explode("\n", $this->configuration['additional_tags']));
      $additional_tags = array_filter($additional_tags);
      $cache_tags = array_merge($cache_tags, $additional_tags);
    }

    if (!count($cache_tags)) {
      if ($this->nextSettingsManager->isDebug()) {
        $this->logger->debug('No cache tags found for revalidation. Entity: @entity_type:@entity_id', [
          '@entity_type' => $entity->getEntityTypeId(),
          '@entity_id' => $entity->id(),
        ]);
      }
      return FALSE;
    }

    // Remove duplicates and convert to comma-separated string.
    $cache_tags = array_unique($cache_tags);
    $cache_tags_string = implode(',', $cache_tags);

    /** @var \Drupal\next\Entity\NextSite $site */
    foreach ($sites as $site) {
      try {
        $revalidate_url = $site->buildRevalidateUrl(['tags' => $cache_tags_string]);
        if (!$revalidate_url) {
          throw new \Exception('No revalidate url set.');
        }

        if ($this->nextSettingsManager->isDebug()) {
          $this->logger->notice('(@action): Revalidating tags %list for the site %site. URL: %url', [
            '@action' => $event->getAction(),
            '%list' => $cache_tags_string,
            '%site' => $site->label(),
            '%url' => $revalidate_url->toString(),
          ]);
        }

        $response = $this->httpClient->request('GET', $revalidate_url->toString());
        if ($response && $response->getStatusCode() === Response::HTTP_OK) {
          if ($this->nextSettingsManager->isDebug()) {
            $this->logger->notice('(@action): Successfully revalidated tags %list for the site %site. URL: %url', [
              '@action' => $event->getAction(),
              '%list' => $cache_tags_string,
              '%site' => $site->label(),
              '%url' => $revalidate_url->toString(),
            ]);
          }

          $revalidated = TRUE;
        }
        else {
          $status_code = $response ? $response->getStatusCode() : 'unknown';
          $this->logger->warning('(@action): Failed to revalidate tags %list for the site %site. HTTP status: %status. URL: %url', [
            '@action' => $event->getAction(),
            '%list' => $cache_tags_string,
            '%site' => $site->label(),
            '%status' => $status_code,
            '%url' => $revalidate_url->toString(),
          ]);
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
