<?php

namespace Drupal\next_jwt\EventSubscriber;

use Drupal\Core\Session\AccountInterface;
use Drupal\jwt\Authentication\Event\JwtAuthEvents;
use Drupal\jwt\Authentication\Event\JwtAuthGenerateEvent;
use Drupal\next\NextSettingsManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Class JwtEventSubscriber.
 */
class JwtEventSubscriber implements EventSubscriberInterface {

  /**
   * The current user.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected AccountInterface $currentUser;

  /**
   * The next settings manager.
   *
   * @var \Drupal\next\NextSettingsManagerInterface
   */
  protected NextSettingsManagerInterface $nextSettingsManager;

  /**
   * Constructor.
   *
   * @param \Drupal\Core\Session\AccountInterface $current_user
   *   The current user.
   * @param \Drupal\next\NextSettingsManagerInterface $next_settings_manager
   *   The next settings manager.
   */
  public function __construct(AccountInterface $current_user, NextSettingsManagerInterface $next_settings_manager) {
    $this->currentUser = $current_user;
    $this->nextSettingsManager = $next_settings_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    $events[JwtAuthEvents::GENERATE][] = ['setStandardClaims', 100];
    $events[JwtAuthEvents::GENERATE][] = ['setDrupalClaims', 99];
    return $events;
  }

  /**
   * Sets the standard claims set for a JWT.
   *
   * @param \Drupal\jwt\Authentication\Event\JwtAuthGenerateEvent $event
   *   The event.
   */
  public function setStandardClaims(JwtAuthGenerateEvent $event) {
    $event->addClaim('iat', time());

    $access_token_expiration = 300;
    $configuration = $this->nextSettingsManager->get('preview_url_generator_configuration');
    if (isset($configuration['access_token_expiration'])) {
      $access_token_expiration = (int) $configuration['access_token_expiration'];
    }

    $event->addClaim('exp', strtotime("+{$access_token_expiration} seconds"));
  }

  /**
   * Sets claims for a Drupal consumer on the JWT.
   *
   * @param \Drupal\jwt\Authentication\Event\JwtAuthGenerateEvent $event
   *   The event.
   */
  public function setDrupalClaims(JwtAuthGenerateEvent $event) {
    $event->addClaim(['drupal', 'uid'], $this->currentUser->id());
  }

}
