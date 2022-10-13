<?php

namespace Drupal\next\Event;

/**
 * Defines an interface for entity revalidated events.
 */
interface EntityRevalidatedEventInterface extends EntityActionEventInterface {

  /**
   * Sets the revalidated value.
   *
   * @param bool $revalidated
   *   The revalidated value.
   *
   * @return \Drupal\next\Event\EntityRevalidatedEventInterface
   *   The entity revalidated event.
   */
  public function setRevalidated(bool $revalidated): self;

  /**
   * Gets the event revalidated value.
   *
   * @return bool
   *   TRUE is the entity was revalidated. FALSE otherwise.
   */
  public function getRevalidated(): bool;

  /**
   * Gets the event revalidated value.
   *
   * @return bool
   *   TRUE is the entity was revalidated. FALSE otherwise.
   */
  public function isRevalidated(): bool;

}
