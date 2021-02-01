<?php

namespace Drupal\next\Plugin;

use Drupal\Component\Plugin\ConfigurableInterface;
use Drupal\Core\Plugin\PluginFormInterface;

/**
 * Defines an interface for the configurable site_resolver plugin.
 */
interface ConfigurableSiteResolverInterface extends SiteResolverInterface, ConfigurableInterface, PluginFormInterface {

  /**
   * Returns a short summary of the plugin configuration.
   *
   * @return array
   *   A short summary of the plugin configuration.
   */
  public function configurationSummary();

}
