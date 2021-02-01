<?php

namespace Drupal\next\Entity;

use Drupal\Core\Config\Entity\ConfigEntityInterface;
use Drupal\Core\Entity\EntityWithPluginCollectionInterface;
use Drupal\next\Plugin\SiteResolverInterface;

/**
 * Provides an interface for next_entity_type_config entity definitions.
 */
interface NextEntityTypeConfigInterface extends ConfigEntityInterface, EntityWithPluginCollectionInterface {

  /**
   * Returns the site_resolver plugin.
   *
   * @return \Drupal\next\Plugin\SiteResolverInterface|null
   *   The site_resolver plugin used by this entity.
   */
  public function getSiteResolver(): ?SiteResolverInterface;

  /**
   * Sets the site_resolver plugin.
   *
   * @param string $plugin_id
   *   The site_resolver plugin ID.
   *
   * @return \Drupal\next\Entity\NextEntityTypeConfigInterface
   *   The next_entity_type_config entity.
   */
  public function setSiteResolver(string $plugin_id): self;

  /**
   * Returns the config for the next_entity_type_config.
   *
   * @return array
   *   The config for the next_entity_type_config.
   */
  public function getConfiguration();

  /**
   * Sets the configuration or the next_entity_type_config.
   *
   * @param array $configuration
   *   A configuration array.
   *
   * @return \Drupal\next\Entity\NextEntityTypeConfigInterface
   *   The next_entity_type_config entity.
   */
  public function setConfiguration(array $configuration): self;

}
