<?php

namespace Drupal\next\Plugin;

use Drupal\Core\Entity\EntityInterface;

/**
 * Defines an interface for the site_resolver plugin.
 */
interface SiteResolverInterface {

  /**
   * Returns the ID of the plugin.
   *
   * @return string
   *   The plugin ID.
   */
  public function getId(): string;

  /**
   * Returns the label for the plugin.
   *
   * @return string
   *   The plugin label.
   */
  public function getLabel(): string;

  /**
   * Returns the description for the plugin.
   *
   * @return string
   *   The plugin description.
   */
  public function getDescription(): string;

  /**
   * Returns an array of next_site entities for the given entity.
   *
   * @return \Drupal\next\Entity\NextSiteInterface[]
   *   An array of next_site entities.
   */
  public function getSitesForEntity(EntityInterface $entity);

}
