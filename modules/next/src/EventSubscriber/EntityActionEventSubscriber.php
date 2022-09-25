<?php

namespace Drupal\next\EventSubscriber;

use Drupal\Core\Logger\LoggerChannelInterface;
use Drupal\next\Event\EntityActionEvent;
use Drupal\next\Event\EntityEvents;
use Drupal\next\NextSettingsManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Defines an event subscriber for entity action events.
 *
 * @see \Drupal\next\Event\EntityActionEvent
 * @see \Drupal\next\EntityEventDispatcher
 */
class EntityActionEventSubscriber implements EventSubscriberInterface {

  /**
   * The logger channel.
   *
   * @var \Drupal\Core\Logger\LoggerChannelInterface
   */
  protected LoggerChannelInterface $logger;

  /**
   * The next settings manager.
   *
   * @var \Drupal\next\NextSettingsManagerInterface
   */
  protected NextSettingsManagerInterface $nextSettingsManager;

  /**
   * EntityActionEventSubscriber constructor.
   *
   * @param \Drupal\next\NextSettingsManagerInterface $next_settings_manager
   *   The next settings manager.
   * @param \Drupal\Core\Logger\LoggerChannelInterface $logger
   *   The logger channel.
   */
  public function __construct(NextSettingsManagerInterface $next_settings_manager,LoggerChannelInterface $logger) {
    $this->logger = $logger;
    $this->nextSettingsManager = $next_settings_manager;
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
    if (!$this->nextSettingsManager->isDebug()) {
      return;
    }

    $this->logger->notice('@type: %action action event dispatched for the entity %entity.', [
      '%action' => $event->getAction(),
      '%entity' => $event->getEntity()->label(),
      '@type' => $event->getEntity()->getEntityTypeId(),
    ]);
  }

}
