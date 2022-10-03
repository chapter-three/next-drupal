<?php

namespace Drupal\next;

use Drupal\Core\Entity\EntityInterface;

/**
 * Defines an interface for entity event dispatcher.
 */
interface EntityEventDispatcherInterface {

  /**
   * Dispatches an entity event.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity.
   * @param string $action
   *   The action.
   * @param array $meta
   *   An array of meta data.
   */
  public function dispatch(EntityInterface $entity, string $action, array $meta = []);

}
