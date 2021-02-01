<?php

namespace Drupal\next\Plugin;

use Drupal\Core\Form\FormStateInterface;

/**
 * Defines a base class for configurable site_resolver plugins.
 */
abstract class ConfigurableSitePreviewerBase extends SitePreviewerBase implements ConfigurableSitePreviewerInterface {

  /**
   * {@inheritdoc}
   */
  public function validateConfigurationForm(array &$form, FormStateInterface $form_state) {

  }

}
