<?php

namespace Drupal\next\Plugin\Next\Revalidator;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\next\Annotation\Revalidator;
use Drupal\next\Plugin\ConfigurableRevalidatorBase;
use Drupal\next\Plugin\RevalidatorInterface;
use GuzzleHttp\Exception\RequestException;
use Symfony\Component\HttpFoundation\Response;

/**
 * Provides a revalidator for paths.
 *
 * @Revalidator(
 *  id = "path",
 *  label = "Path",
 *  description = "Path-based on-demand revalidation."
 * )
 */
class Path extends ConfigurableRevalidatorBase implements RevalidatorInterface {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'revalidate_page' => NULL,
      'additional_paths' => NULL,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    $form['revalidate_page'] = [
      '#title' => $this->t('Revalidate page'),
      '#description' => $this->t('Revalidate the page for the entity on update.'),
      '#type' => 'checkbox',
      '#default_value' => $this->configuration['revalidate_page'],
    ];

    $form['additional_paths'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Additional paths'),
      '#default_value' => $this->configuration['additional_paths'],
      '#description' => $this->t('Additional paths to revalidate on entity update. Enter one path per line. Example %example.', [
        '%example' => '/blog',
      ]),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
    $this->configuration['revalidate_page'] = $form_state->getValue('revalidate_page');
    $this->configuration['additional_paths'] = $form_state->getValue('additional_paths');
  }

  /**
   * {@inheritdoc}
   */
  public function revalidate(EntityInterface $entity, array $sites, string $action) {
    if (!count($sites)) {
      return NULL;
    }

    $paths = $this->getPathsForEntity($entity);

    if (!count($paths)) {
      return NULL;
    }

    foreach ($paths as $path) {
      foreach ($sites as $site) {
        try {
          $revalidate_url = $site->getRevalidateUrlForPath($path);

          if (!$revalidate_url) {
            throw new \Exception('No revalidate url set.');
          }

          if ($this->nextSettingsManager->isDebug()) {
            $this->logger->notice('(@action): Revalidating path %path for the site %site. URL: %url', [
              '@action' => $action,
              '%path' => $path,
              '%site' => $site->label(),
              '%url' => $revalidate_url->toString(),
            ]);
          }

          $response = $this->httpClient->get($revalidate_url->toString());
          if ($response->getStatusCode() === Response::HTTP_OK) {
            if ($this->nextSettingsManager->isDebug()) {
              $this->logger->notice('(@action): Successfully revalidated path %path for the site %site. URL: %url', [
                '@action' => $action,
                '%path' => $path,
                '%site' => $site->label(),
                '%url' => $revalidate_url->toString(),
              ]);
            }
          }
        }
        catch (RequestException $exception) {
          watchdog_exception('next', $exception);
        }
      }
    }
  }

  /**
   * Returns an array of paths to revalidate for the given entity.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity.
   *
   * @return array
   *   An array of paths.
   *
   * @throws \Drupal\Core\Entity\EntityMalformedException
   */
  public function getPathsForEntity(EntityInterface $entity): array {
    $paths = [];

    if (!empty($this->configuration['revalidate_page']) && $entity->hasLinkTemplate('canonical')) {
      $paths[] = $entity->toUrl()->toString();
    }

    if (!empty($this->configuration['additional_paths'])) {
      $paths = array_merge($paths, array_map('trim', explode("\n", $this->configuration['additional_paths'])));
    }

    return $paths;
  }

}
