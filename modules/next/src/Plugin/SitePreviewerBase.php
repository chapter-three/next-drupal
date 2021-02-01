<?php

namespace Drupal\next\Plugin;

use Drupal\Core\Plugin\PluginBase;

/**
 * Defines a base class for site_previewer plugins.
 */
abstract class SitePreviewerBase extends PluginBase implements SitePreviewerInterface {

  /**
   * {@inheritdoc}
   */
  public function getId(): string {
    return $this->pluginDefinition['id'];
  }

  /**
   * {@inheritdoc}
   */
  public function getLabel(): String {
    return $this->pluginDefinition['label'];
  }

  /**
   * {@inheritdoc}
   */
  public function getDescription(): String {
    return $this->pluginDefinition['description'];
  }

}
