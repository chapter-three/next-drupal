<?php

namespace Drupal\next;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\next\Entity\NextEntityTypeConfigInterface;
use Drupal\next\Plugin\RevalidatorInterface;
use Drupal\next\Plugin\SiteResolverInterface;
use Drupal\node\NodeInterface;

/**
 * Defines the next entity type manager service.
 */
class NextEntityTypeManager implements NextEntityTypeManagerInterface {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * NextEntityTypeManager constructor.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager) {
    $this->entityTypeManager = $entity_type_manager;
  }

  /**
   * {@inheritdoc}
   */
  public function getConfigForEntityType(string $entity_type_id, string $bundle): ?NextEntityTypeConfigInterface {
    $id = sprintf('%s.%s', $entity_type_id, $bundle);

    /** @var \Drupal\next\Entity\NextEntityTypeConfigInterface $next_entity_type_config */
    $next_entity_type_config = $this->entityTypeManager->getStorage('next_entity_type_config')->load($id);

    return $next_entity_type_config;
  }

  /**
   * {@inheritdoc}
   */
  public function getConfigEntityTypeIds() {
    $ids = [];

    $entities = $this->entityTypeManager->getStorage('next_entity_type_config')->loadMultiple();
    foreach ($entities as $entity) {
      [$entity_type_id] = explode('.', $entity->id());
      $ids[$entity_type_id] = $entity_type_id;
    }

    return array_unique($ids);
  }

  /**
   * {@inheritdoc}
   */
  public function getEntityFromRouteMatch(RouteMatchInterface $route_match): ?EntityInterface {
    $entity_types_ids = $this->getConfigEntityTypeIds();

    // TODO: Handle all revisionable entity types.
    $revision_routes = ['entity.node.revision', 'entity.node.latest_version'];
    if (in_array($route_match->getRouteName(), $revision_routes) && in_array('node', $entity_types_ids)) {
      $node_revision = $route_match->getParameter('node_revision');
      if ($node_revision instanceof NodeInterface) {
        return $node_revision;
      }

      if ($route_match->getRouteName() === 'entity.node.latest_version') {
        $node_revision = $route_match->getParameter('node')->getRevisionId();
      }

      return $this->entityTypeManager->getStorage('node')->loadRevision($node_revision);
    }

    foreach ($route_match->getParameters() as $parameter) {
      if ($parameter instanceof EntityInterface && in_array($parameter->getEntityTypeId(), $entity_types_ids)) {
        return $parameter;
      }
    }

    return NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function isEntityRevisionable(EntityInterface $entity): bool {
    if (\Drupal::hasService('jsonapi.resource_type.repository')) {
      /* @var \Drupal\jsonapi\ResourceType\ResourceTypeRepositoryInterface $resource_type_repository */
      $resource_type_repository = \Drupal::service('jsonapi.resource_type.repository');
      $resource = $resource_type_repository->get($entity->getEntityTypeId(), $entity->bundle());
      return $resource->isVersionable() && $entity->getEntityType()->isRevisionable();
    }

    return $entity->getEntityType()->isRevisionable();
  }

  /**
   * {@inheritdoc}
   */
  public function getSitesForEntity(EntityInterface $entity): array {
    $site_resolver = $this->getSiteResolver($entity);
    if (!$site_resolver) {
      return [];
    }

    return $site_resolver->getSitesForEntity($entity);
  }

  /**
   * {@inheritdoc}
   */
  public function getSiteResolver(EntityInterface $entity): ?SiteResolverInterface {
    if ($next_entity_type_config = $this->getConfigForEntityType($entity->getEntityTypeId(), $entity->bundle())) {
      return $next_entity_type_config->getSiteResolver();
    }

    return NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function getRevalidator(EntityInterface $entity): ?RevalidatorInterface {
    if ($next_entity_type_config = $this->getConfigForEntityType($entity->getEntityTypeId(), $entity->bundle())) {
      return $next_entity_type_config->getRevalidator();
    }

    return NULL;
  }

}
