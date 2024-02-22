<?php

namespace Drupal\next\EventSubscriber;

use Drupal\next\NextEntityTypeManagerInterface;
use Drupal\next\NextSettingsManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

/**
 * Defines an entity action event subscriber.
 */
abstract class EntityActionEventSubscriberBase implements EventSubscriberInterface {

  /**
   * The next entity type manager.
   *
   * @var \Drupal\next\NextEntityTypeManagerInterface
   */
  protected NextEntityTypeManagerInterface $nextEntityTypeManager;

  /**
   * The next settings manager.
   *
   * @var \Drupal\next\NextSettingsManagerInterface
   */
  protected NextSettingsManagerInterface $nextSettingsManager;

  /**
   * The logger channel.
   *
   * @var \Psr\Log\LoggerInterface
   */
  protected LoggerInterface $logger;

  /**
   * The event dispatcher.
   *
   * @var \Symfony\Component\EventDispatcher\EventDispatcherInterface
   */
  protected EventDispatcherInterface $eventDispatcher;

  /**
   * EntityActionEventSubscriber constructor.
   *
   * @param \Drupal\next\NextEntityTypeManagerInterface $next_entity_type_manager
   *   The next entity type manager.
   * @param \Drupal\next\NextSettingsManagerInterface $next_settings_manager
   *   The next settings manager.
   * @param \Psr\Log\LoggerInterface $logger
   *   The logger channel.
   * @param \Symfony\Component\EventDispatcher\EventDispatcherInterface $event_dispatcher
   *   The event dispatcher.
   */
  public function __construct(NextEntityTypeManagerInterface $next_entity_type_manager, NextSettingsManagerInterface $next_settings_manager, LoggerInterface $logger, EventDispatcherInterface $event_dispatcher) {
    $this->nextEntityTypeManager = $next_entity_type_manager;
    $this->nextSettingsManager = $next_settings_manager;
    $this->logger = $logger;
    $this->eventDispatcher = $event_dispatcher;
  }

}
