<?php

namespace Drupal\next\Event;

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
