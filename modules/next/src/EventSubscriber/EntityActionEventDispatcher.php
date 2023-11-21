<?php

namespace Drupal\next\EventSubscriber;

use Drupal\Core\DestructableInterface;
use Drupal\next\Event\EntityActionEvent;
use Drupal\next\Event\EntityEvents;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

final class EntityActionEventDispatcher implements DestructableInterface {

  /**
   * @var \Drupal\next\Event\EntityActionEvent[]
   */
  private array $events = [];

  public function __construct(
    private EventDispatcherInterface $eventDispatcher
    ) {
  }

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
