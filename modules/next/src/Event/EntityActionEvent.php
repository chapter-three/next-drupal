<?php

namespace Drupal\next\Event;

use Drupal\Component\EventDispatcher\Event;
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
   * Additional meta data for the event.
   *
   * @var array|null
   */
  protected ?array $meta;

  /**
   * EntityActionEvent constructor.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity.
   * @param array $sites
   *   The sites for the entity.
   * @param string $action
   *   The action.
   * @param array $meta
   *   Additional meta data for the event.
   */
  public function __construct(EntityInterface $entity, array $sites, string $action, array $meta = []) {
    $this->entity = $entity;
    $this->sites = $sites;
    $this->action = $action;
    $this->meta = $meta;
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

  /**
   * {@inheritdoc}
   */
  public function getMeta(): array {
    return $this->meta;
  }

}
