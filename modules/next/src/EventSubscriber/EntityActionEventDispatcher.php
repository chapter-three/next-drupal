<?php

namespace Drupal\next\EventSubscriber;

use Drupal\Core\DestructableInterface;
use Drupal\next\Event\EntityActionEvent;
use Drupal\next\Event\EntityEvents;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

/**
 * Defines an event subscriber for dispatching entity events.
 */
final class EntityActionEventDispatcher implements DestructableInterface {

  /**
   * The events to dispach.
   *
   * @var \Drupal\next\Event\EntityActionEvent[]
   */
  private array $events = [];

  /**
   * EntityActionEventDispatcher constructor.
   */
  public function __construct(
    private EventDispatcherInterface $eventDispatcher
    ) {
  }

  /**
   * Adds an event to be dispatched at the end of the request.
   *
   * @param \Drupal\next\Event\EntityActionEvent $event
   *   The event.
   */
  public function addEvent(EntityActionEvent $event): void {
    $this->events[] = $event;
  }

  /**
   * {@inheritdoc}
   */
  public function destruct() {
    foreach ($this->events as $event) {
      $this->eventDispatcher->dispatch($event, EntityEvents::ENTITY_ACTION);
    }
  }

}
