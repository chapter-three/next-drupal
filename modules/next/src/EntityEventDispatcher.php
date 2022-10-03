<?php

namespace Drupal\next;

use Drupal\Component\EventDispatcher\ContainerAwareEventDispatcher;
use Drupal\Core\Entity\EntityInterface;
use Drupal\next\Event\EntityActionEvent;
use Drupal\next\Event\EntityEvents;

/**
 * Defines a service to dispatching entity events.
 */
class EntityEventDispatcher implements EntityEventDispatcherInterface {

  /**
   * The event dispatcher.
   *
   * @var \Drupal\Component\EventDispatcher\ContainerAwareEventDispatcher
   */
  protected ContainerAwareEventDispatcher $eventDispatcher;

  /**
   * The next entity type manager.
   *
   * @var \Drupal\next\NextEntityTypeManagerInterface
   */
  protected NextEntityTypeManagerInterface $nextEntityTypeManager;

  /**
   * EntityEventDispatcher constructor.
   *
   * @param \Drupal\Component\EventDispatcher\ContainerAwareEventDispatcher $event_dispatcher
   *   The event dispatcher.
   * @param \Drupal\next\NextEntityTypeManagerInterface $next_entity_type_manager
   *   The next entity type manager.
   */
  public function __construct(ContainerAwareEventDispatcher $event_dispatcher, NextEntityTypeManagerInterface $next_entity_type_manager) {
    $this->eventDispatcher = $event_dispatcher;
    $this->nextEntityTypeManager = $next_entity_type_manager;
  }

  /**
   * {@inheritdoc}
   */
  public function dispatch(EntityInterface $entity, string $action, array $meta = []) {
    $sites = $this->nextEntityTypeManager->getSitesForEntity($entity);

    $event = new EntityActionEvent($entity, $sites, $action, $meta);

    $this->eventDispatcher->dispatch($event, EntityEvents::ENTITY_ACTION);
  }

}
