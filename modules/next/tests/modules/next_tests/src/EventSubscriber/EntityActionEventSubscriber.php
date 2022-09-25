<?php

namespace Drupal\next_tests\EventSubscriber;

use Drupal\Core\Logger\LoggerChannelInterface;
use Drupal\next\Event\EntityActionEvent;
use Drupal\next\Event\EntityEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Defines an event subscriber for entity action events.
 */
class EntityActionEventSubscriber implements EventSubscriberInterface {

  /**
   * The logger channel.
   *
   * @var \Drupal\Core\Logger\LoggerChannelInterface
   */
  protected LoggerChannelInterface $logger;

  /**
   * EntityActionEventSubscriber constructor.
   *
   * @param \Drupal\Core\Logger\LoggerChannelInterface $logger
   *   The logger channel.
   */
  public function __construct(LoggerChannelInterface $logger) {
    $this->logger = $logger;
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
    $this->logger->notice('Event @event dispatched for entity @label and action @action.', [
      '@event' => EntityEvents::ENTITY_ACTION,
      '@label' => $event->getEntity()->label(),
      '@action' => $event->getAction(),
    ]);
  }

}
