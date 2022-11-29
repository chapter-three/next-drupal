<?php

namespace Drupal\next\Plugin;

use Drupal\Core\Entity\EntityInterface;
use Drupal\next\Event\EntityActionEvent;

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
   * @param \Drupal\next\Event\EntityActionEvent $event
   *   The entity action event.
   *
   * @return bool
   *   TRUE if the entity was revalidated. FALSE otherwise.
   */
  public function revalidate(EntityActionEvent $event): bool;

}
