<?php

namespace Drupal\next\Plugin;

use Drupal\Core\Plugin\PluginBase;

/**
 * Defines a base class for site_resolver plugins.
 */
abstract class SiteResolverBase extends PluginBase implements SiteResolverInterface {

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
