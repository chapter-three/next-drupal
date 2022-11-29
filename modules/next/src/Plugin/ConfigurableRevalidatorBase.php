<?php

namespace Drupal\next\Plugin;

use Drupal\Core\Form\FormStateInterface;

/**
 * Defines a base class for configurable revalidator plugins.
 */
abstract class ConfigurableRevalidatorBase extends RevalidatorBase implements ConfigurableRevalidatorInterface {

  /**
   * {@inheritdoc}
   */
  public function validateConfigurationForm(array &$form, FormStateInterface $form_state) {

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
    return $this;
  }

}
