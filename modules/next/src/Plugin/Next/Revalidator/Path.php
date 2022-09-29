<?php

namespace Drupal\next\Plugin\Next\Revalidator;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\next\Annotation\Revalidator;
use Drupal\next\Plugin\ConfigurableRevalidatorBase;
use Drupal\next\Plugin\RevalidatorInterface;

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
  public function getPathsForEntity(EntityInterface $entity): array {
    $paths = [];

    if ($this->configuration['revalidate_page']) {
      $paths[] = $entity->toUrl()->toString();
    }

    if ($this->configuration['additional_paths']) {
      $paths = array_merge($paths, array_map('trim', explode("\n", $this->configuration['additional_paths'])));
    }

    return $paths;
  }

}
