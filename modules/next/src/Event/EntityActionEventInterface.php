<?php

namespace Drupal\next\Event;

use Drupal\Core\Entity\EntityInterface;

/**
 * Defines an interface for entity action events.
 */
interface EntityActionEventInterface {

  /**
   * The entity insert action.
   */
  public const INSERT_ACTION = 'insert';

  /**
   * The entity update action.
   */
  public const UPDATE_ACTION = 'update';

  /**
   * The entity delete action. We use predelete because we need access to the entity for revalidating.
   */
  public const DELETE_ACTION = 'delete';

  /**
   * Get the entity for the action.
   *
   * @return \Drupal\Core\Entity\EntityInterface
   *   The entity
   */
  public function getEntity(): EntityInterface;

  /**
   * Get the sites for the entity.
   *
   * @return \Drupal\next\Entity\NextSiteInterface[]
   *   The sites for the entity.
   */
  public function getSites(): array;

  /**
   * Get the action for the entity.
   *
   * @return string
   *   The action.
   */
  public function getAction(): string;

}
