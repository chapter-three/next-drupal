<?php

namespace Drupal\next\Event;

use Drupal\Core\Entity\EntityInterface;

/**
 * Defines an entity revalidated event.
 *
 * @see \Drupal\next\Event\EntityEvents
 */
class EntityRevalidatedEvent extends EntityActionEvent implements EntityRevalidatedEventInterface {

  /**
   * The revalidated value.
   *
   * @var bool
   */
  protected bool $revalidated;

  /**
   * Helper to create an entity action event.
   *
   * @param \Drupal\next\Event\EntityActionEventInterface $event
   *   The entity action event.
   *
   * @return \Drupal\next\Event\EntityRevalidatedEvent
   *   An instance of entity action event.
   */
  public static function createFromEntityActionEvent(EntityActionEventInterface $event): self {
    return new static($event->getEntity(), $event->getAction(), $event->getSites(), $event->getEntityUrl());
  }

  /**
   * {@inheritdoc}
   */
  public function setRevalidated(bool $revalidated): EntityRevalidatedEventInterface {
    $this->revalidated = $revalidated;
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getRevalidated(): bool {
    return $this->revalidated;
  }

  /**
   * {@inheritdoc}
   */
  public function isRevalidated(): bool {
    return $this->getRevalidated();
  }

}
