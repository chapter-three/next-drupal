<?php

namespace Drupal\next\Plugin;

use Drupal\Core\Entity\EntityInterface;

/**
 * Defines an interface for the revalidator plugin.
 */
interface RevalidatorInterface {

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
   * Revalidates an entity.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity.
   * @param \Drupal\next\Entity\NextSiteInterface[] $sites
   *   The sites for the entity.
   * @param string $action
   *   The action.
   */
  public function revalidate(EntityInterface $entity, array $sites, string $action);

}
