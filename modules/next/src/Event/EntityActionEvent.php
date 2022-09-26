<?php

namespace Drupal\next\Event;

use Symfony\Component\EventDispatcher\Event;
use Drupal\Core\Entity\EntityInterface;

/**
 * Defines an entity action event.
 *
 * @see \Drupal\next\Event\EntityEvents
 */
class EntityActionEvent extends Event implements EntityActionEventInterface {

  /**
   * The entity.
   *
   * @var \Drupal\Core\Entity\EntityInterface
   */
  protected EntityInterface $entity;

  /**
   * The sites for this entity.
   *
   * @var \Drupal\next\Entity\NextSiteInterface[]
   */
  protected array $sites;

  /**
   * The action.
   *
   * @var string
   */
  protected string $action;

  /**
   * EntityActionEvent constructor.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity.
   * @param array $sites
   *   The sites for the entity.
   * @param string $action
   *   The action.
   */
  public function __construct(EntityInterface $entity, array $sites, string $action) {
    $this->entity = $entity;
    $this->sites = $sites;
    $this->action = $action;
  }

  /**
   * {@inheritdoc}
   */
  public function getEntity(): EntityInterface {
    return $this->entity;
  }

  /**
   * {@inheritdoc}
   */
  public function getSites(): array {
    return $this->sites;
  }

  /**
   * {@inheritdoc}
   */
  public function getAction(): string {
    return $this->action;
  }

}
