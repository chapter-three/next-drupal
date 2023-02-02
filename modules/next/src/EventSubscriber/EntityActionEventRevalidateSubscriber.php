<?php

namespace Drupal\next\EventSubscriber;

use Drupal\next\Event\EntityActionEvent;
use Drupal\next\Event\EntityEvents;
use Drupal\next\Event\EntityRevalidatedEvent;

/**
 * Defines an event subscriber for revalidating entity.
 *
 * @see \Drupal\next\Event\EntityActionEvent
 * @see \Drupal\next\EntityEventDispatcher
 */
class EntityActionEventRevalidateSubscriber extends EntityActionEventSubscriberBase {

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    $events[EntityEvents::ENTITY_ACTION] = ['onAction'];
    return $events;
  }

  /**
   * Revalidates the entity.
   *
   * @param \Drupal\next\Event\EntityActionEvent $event
   *   The event.
   */
  public function onAction(EntityActionEvent $event) {
    if ($revalidator = $this->nextEntityTypeManager->getRevalidator($event->getEntity())) {
      $revalidated = $revalidator->revalidate($event);

      // Dispatch post revalidation event.
      $revalidated_event = EntityRevalidatedEvent::createFromEntityActionEvent($event);
      $revalidated_event->setRevalidated($revalidated);
      $this->eventDispatcher->dispatch($revalidated_event, EntityEvents::ENTITY_REVALIDATED);
    }

    return NULL;
  }

}
