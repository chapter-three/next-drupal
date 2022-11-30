<?php

namespace Drupal\next\Event;

/**
 * Defines entity events.
 */
final class EntityEvents {

  /**
   * Name of the event fired when any of the following action happens.
   *
   * @Event
   *
   * @see next_entity_insert()
   * @see next_entity_update()
   * @see next_entity_predelete()
   *
   * @see \Drupal\next\Event\EntityActionEvent
   */
  public const ENTITY_ACTION = 'next.entity.action';

  /**
   * Name of the event fired when an entity is revalidated.
   *
   * @see \Drupal\next\Event\EntityRevalidatedEvent
   * @see \Drupal\next\EventSubscriber\EntityActionEventRevalidateSubscriber::onAction()
   */
  public const ENTITY_REVALIDATED = 'next.entity.revalidated';

}
