<?php

namespace Drupal\next\Event;

use Drupal\Core\Entity\EntityInterface;

/**
 * Defines an interface for entity action events.
 */
interface EntityActionEventInterface {

  /**
   * The entity insert action.
   */
  public const INSERT_ACTION = 'insert';

  /**
   * The entity update action.
   */
  public const UPDATE_ACTION = 'update';

  /**
   * The entity delete action. We use predelete because we need access to the entity for revalidating.
   */
  public const DELETE_ACTION = 'delete';

  /**
   * Get the entity for the action.
   *
   * @return \Drupal\Core\Entity\EntityInterface
   *   The entity
   */
  public function getEntity(): EntityInterface;

  /**
   * Sets the entity for the action.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity.
   *
   * @return \Drupal\next\Event\EntityActionEventInterface
   *   The event entity.
   */
  public function setEntity(EntityInterface $entity): self;

  /**
   * Get the sites for the entity.
   *
   * @return \Drupal\next\Entity\NextSiteInterface[]
   *   The sites for the entity.
   */
  public function getSites(): array;

  /**
   * Sets the sites.
   *
   * @param \Drupal\next\Entity\NextSiteInterface[] $sites
   *   An array of next_site entities.
   *
   * @return \Drupal\next\Event\EntityActionEventInterface
   *   The event entity.
   */
  public function setSites(array $sites): self;

  /**
   * Get the action for the entity.
   *
   * @return string
   *   The action.
   */
  public function getAction(): string;

  /**
   * Sets the action.
   *
   * @param string $action
   *   The action.
   *
   * @return \Drupal\next\Event\EntityActionEventInterface
   *   The event entity.
   */
  public function setAction(string $action): self;

  /**
   * Gets the url for the entity.
   *
   * @return string|null
   *   The entity url.
   */
  public function getEntityUrl(): ?string;

  /**
   * Sets the url for the entity.
   *
   * @param string $url
   *   The entity url.
   *
   * @return \Drupal\next\Event\EntityActionEventInterface
   *   The event entity.
   */
  public function setEntityUrl(string $url): self;

}
