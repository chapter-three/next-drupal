<?php

namespace Drupal\next\Entity;

use Drupal\Core\Config\Entity\ConfigEntityInterface;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityWithPluginCollectionInterface;
use Drupal\next\Plugin\RevalidatorInterface;
use Drupal\next\Plugin\SiteResolverInterface;
use Drupal\next\RevalidatorPluginCollection;
use Drupal\next\SiteResolverPluginCollection;

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
   * Returns the revalidator plugin.
   *
   * @return \Drupal\next\Plugin\Next\Revalidator\|null
   *   The revalidator plugin used by this entity.
   */
  public function getRevalidator(): ?RevalidatorInterface;

  /**
   * Sets the revalidator plugin.
   *
   * @param string $plugin_id
   *   The revalidator plugin ID.
   *
   * @return \Drupal\next\Entity\NextEntityTypeConfigInterface
   *   The next_entity_type_config entity.
   */
  public function setRevalidator(string $plugin_id): self;

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

  /**
   * Returns the config for the site resolver.
   *
   * @return array
   *   The config for the site resolver.
   */
  public function getSiteResolverConfiguration();

  /**
   * Sets the configuration for the site resolver.
   *
   * @param string $id
   *   The plugin id.
   * @param array $configuration
   *   A configuration array.
   *
   * @return \Drupal\next\Entity\NextEntityTypeConfigInterface
   *   The next_entity_type_config entity.
   */
  public function setSiteResolverConfiguration(string $id, array $configuration): self;

  /**
   * Returns the config for the next_entity_type_config.
   *
   * @return array
   *   The config for the next_entity_type_config.
   */
  public function getRevalidatorConfiguration();

  /**
   * Sets the configuration or the next_entity_type_config.
   *
   * @param string $id
   *   The plugin id.
   * @param array $configuration
   *   A configuration array.
   *
   * @return \Drupal\next\Entity\NextEntityTypeConfigInterface
   *   The next_entity_type_config entity.
   */
  public function setRevalidatorConfiguration(string $id, array $configuration): self;

  /**
   * Encapsulates the creation of the LazyPluginCollection.
   *
   * @return \Drupal\Component\Plugin\LazyPluginCollection
   *   The plugin collection.
   */
  public function getRevalidatorPluginCollection();

  /**
   * Encapsulates the creation of the LazyPluginCollection.
   *
   * @return \Drupal\Component\Plugin\LazyPluginCollection
   *   The plugin collection.
   */
  public function getPluginCollection();

}
