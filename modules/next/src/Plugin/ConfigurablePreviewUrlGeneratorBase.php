<?php

namespace Drupal\next\Plugin;

use Drupal\Core\Form\FormStateInterface;

/**
 * Defines a base class for configurable preview_url_generator plugins.
 */
abstract class ConfigurablePreviewUrlGeneratorBase extends PreviewUrlGeneratorBase implements ConfigurablePreviewUrlGeneratorInterface {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function getConfiguration() {
    return $this->configuration;
  }

  /**
   * {@inheritdoc}
   */
  public function setConfiguration(array $configuration) {
    $this->configuration = $configuration + $this->defaultConfiguration();
  }

  /**
   * {@inheritdoc}
   */
  public function validateConfigurationForm(array &$form, FormStateInterface $form_state) {

  }

}
