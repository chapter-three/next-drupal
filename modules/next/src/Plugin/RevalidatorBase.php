<?php

namespace Drupal\next\Plugin;

use Drupal\Core\Plugin\PluginBase;

/**
 * Defines a base class for revalidator plugins.
 */
abstract class RevalidatorBase extends PluginBase implements RevalidatorInterface {

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
