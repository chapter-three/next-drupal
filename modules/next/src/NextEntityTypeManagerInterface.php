<?php

namespace Drupal\next;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\next\Entity\NextEntityTypeConfigInterface;

/**
 * Defines an interface for next entity type manager service.
 */
interface NextEntityTypeManagerInterface {

  /**
   * Returns config for the provided entity type and bundle.
   *
   * @param string $entity_type_id
   *   The entity type id.
   * @param string $bundle
   *   The bundle.
   *
   * @return \Drupal\next\Entity\NextEntityTypeConfigInterface|null
   *   The next_entity_type_config entity.
   */
  public function getConfigForEntityType(string $entity_type_id, string $bundle): ?NextEntityTypeConfigInterface;

  /**
   * Returns an entity from route match.
   *
   * @param \Drupal\Core\Routing\RouteMatchInterface $route_match
   *   The current route match.
   *
   * @return \Drupal\Core\Entity\EntityInterface|null
   *   The entity if found otherwise null.
   */
  public function getEntityFromRouteMatch(RouteMatchInterface $route_match): ?EntityInterface;

  /**
   * Returns an array of configured entity type ids.
   *
   * @return array
   *   An array of configured entity type ids.
   */
  public function getConfigEntityTypeIds();

  /**
   * Returns true if given entity is revisionable.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity.
   *
   * @return bool
   *   TRUE is revisionable. FALSE otherwise.
   */
  public function isEntityRevisionable(EntityInterface $entity): bool;

}
