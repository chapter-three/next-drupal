<?php

namespace Drupal\next;

use Drupal\Component\Plugin\PluginManagerInterface;
use Drupal\Core\Plugin\DefaultSingleLazyPluginCollection;

/**
 * Provides a container for lazily loading revalidator plugins.
 */
class RevalidatorPluginCollection extends DefaultSingleLazyPluginCollection {

  /**
   * The next_entity_type_config ID this plugin collection belongs to.
   *
   * @var string
   */
  protected $nextEntityTypeConfigId;

  /**
   * Constructs a new RevalidatorPluginCollection.
   *
   * @param \Drupal\Component\Plugin\PluginManagerInterface $manager
   *   The manager to be used for instantiating plugins.
   * @param string $instance_id
   *   The ID of the plugin instance.
   * @param array $configuration
   *   An array of configuration.
   * @param string $next_entity_type_config_id
   *   The unique ID of the next_entity_type_config entity using this plugin.
   */
  public function __construct(PluginManagerInterface $manager, $instance_id, array $configuration, $next_entity_type_config_id) {
    parent::__construct($manager, $instance_id, $configuration);

    $this->nextEntityTypeConfigId = $next_entity_type_config_id;
  }

}
