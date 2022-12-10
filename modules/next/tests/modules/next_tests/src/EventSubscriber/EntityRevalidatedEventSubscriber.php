<?php

namespace Drupal\next_tests\EventSubscriber;

use Drupal\Core\Logger\LoggerChannelInterface;
use Drupal\next\Event\EntityEvents;
use Drupal\next\Event\EntityRevalidatedEventInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Defines an event subscriber for entity revalidated events.
 */
class EntityRevalidatedEventSubscriber implements EventSubscriberInterface {

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
    $events[EntityEvents::ENTITY_REVALIDATED] = ['onRevalidated'];
    return $events;
  }

  /**
   * Logs the event.
   *
   * @param \Drupal\next\Event\EntityRevalidatedEventInterface $event
   *   The event.
   */
  public function onRevalidated(EntityRevalidatedEventInterface $event) {
    $this->logger->notice('Entity @label, action @action, revalidated @revalidated.', [
      '@event' => EntityEvents::ENTITY_REVALIDATED,
      '@label' => $event->getEntity()->label(),
      '@action' => $event->getAction(),
      '@revalidated' => (int) $event->isRevalidated(),
    ]);
  }

}
