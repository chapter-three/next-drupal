<?php

namespace Drupal\next\Entity;

use Drupal\Core\Config\Entity\ConfigEntityInterface;
use Drupal\Core\Entity\EntityInterface;
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

  /**
   * Returns the value for revalidate.
   *
   * @return bool
   *   TRUE if should revalidate. FALSE otherwise.
   */
  public function getRevalidate(): bool;

  /**
   * Sets the value for revalidate.
   *
   * @param bool $revalidate
   *   The value for revalidate.
   *
   * @return \Drupal\next\Entity\NextEntityTypeConfigInterface
   *   The next_entity_type_config entity.
   */
  public function setRevalidate(bool $revalidate): self;

  /**
   * Returns the value for revalidate_page.
   *
   * @return bool
   *   TRUE if should revalidate page. FALSE otherwise.
   */
  public function getRevalidatePage(): bool;

  /**
   * Sets the value for revalidate_page.
   *
   * @param bool $revalidate_page
   *   The value for revalidate_page.
   *
   * @return \Drupal\next\Entity\NextEntityTypeConfigInterface
   *   The next_entity_type_config entity.
   */
  public function setRevalidatePage(bool $revalidate_page): self;

  /**
   * Returns the value for revalidate_paths.
   *
   * @return string|null
   *   Paths to revalidate.
   */
  public function getRevalidatePaths(): ?string;

  /**
   * Sets the value for revalidate_paths.
   *
   * @param string $revalidate_paths
   *   Paths to revalidate.
   *
   * @return \Drupal\next\Entity\NextEntityTypeConfigInterface
   *   The next_entity_type_config entity.
   */
  public function setRevalidatePaths(string $revalidate_paths): self;

  /**
   * Returns an array of paths to revalidate for an entity.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity.
   *
   * @return array
   *   The array of paths to revalidate for the given entity.
   */
  public function getRevalidatePathsForEntity(EntityInterface $entity): array;

}
