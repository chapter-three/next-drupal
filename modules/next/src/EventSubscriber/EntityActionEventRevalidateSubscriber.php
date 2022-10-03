<?php

namespace Drupal\next\EventSubscriber;

use Drupal\Core\Logger\LoggerChannelInterface;
use Drupal\next\Event\EntityActionEvent;
use Drupal\next\Event\EntityEvents;
use Drupal\next\NextEntityTypeManagerInterface;
use Drupal\next\NextSettingsManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Defines an event subscriber for revalidating entity.
 *
 * @see \Drupal\next\Event\EntityActionEvent
 * @see \Drupal\next\EntityEventDispatcher
 */
class EntityActionEventRevalidateSubscriber implements EventSubscriberInterface {

  /**
   * The next entity type manager.
   *
   * @var \Drupal\next\NextEntityTypeManagerInterface
   */
  protected $nextEntityTypeManager;

  /**
   * EntityActionEventSubscriber constructor.
   *
   * @param \Drupal\next\NextEntityTypeManagerInterface $next_entity_type_manager
   *   The next entity type manager.
   */
  public function __construct(NextEntityTypeManagerInterface $next_entity_type_manager) {
    $this->nextEntityTypeManager = $next_entity_type_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    $events[EntityEvents::ENTITY_ACTION] = ['onAction'];
    return $events;
  }

  /**
   * Logs the event.
   *
   * @param \Drupal\next\Event\EntityActionEvent $event
   *   The event.
   */
  public function onAction(EntityActionEvent $event) {
    $entity = $event->getEntity();
    $next_entity_type_config = $this->nextEntityTypeManager->getConfigForEntityType($entity->getEntityTypeId(), $entity->bundle());
    if (!$next_entity_type_config) {
      return;
    }

    $revalidator = $next_entity_type_config->getRevalidator();
    if (!$revalidator) {
      return;
    }

    $revalidator->revalidate($event->getEntity(), $event->getSites(), $event->getAction());
  }

}
