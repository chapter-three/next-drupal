<?php

namespace Drupal\next_jsonapi\Controller;

use Drupal\Component\Datetime\TimeInterface;
use Drupal\Core\Entity\EntityFieldManagerInterface;
use Drupal\Core\Entity\EntityRepositoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Render\RendererInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\jsonapi\Access\EntityAccessChecker;
use Drupal\jsonapi\Context\FieldResolver;
use Drupal\jsonapi\Controller\EntityResource as JsonApiEntityResource;
use Drupal\jsonapi\IncludeResolver;
use Drupal\jsonapi\Query\OffsetPage;
use Drupal\jsonapi\ResourceType\ResourceType;
use Drupal\jsonapi\ResourceType\ResourceTypeRepositoryInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * Process all entity requests.
 */
class EntityResource extends JsonApiEntityResource {

  /**
   * The offset max size.
   *
   * @var int
   */
  protected $maxSize;

  /**
   * EntityResource constructor.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\Core\Entity\EntityFieldManagerInterface $field_manager
   *   The entity type field manager.
   * @param \Drupal\jsonapi\ResourceType\ResourceTypeRepositoryInterface $resource_type_repository
   *   The JSON:API resource type repository.
   * @param \Drupal\Core\Render\RendererInterface $renderer
   *   The renderer.
   * @param \Drupal\Core\Entity\EntityRepositoryInterface $entity_repository
   *   The entity repository.
   * @param \Drupal\jsonapi\IncludeResolver $include_resolver
   *   The include resolver.
   * @param \Drupal\jsonapi\Access\EntityAccessChecker $entity_access_checker
   *   The JSON:API entity access checker.
   * @param \Drupal\jsonapi\Context\FieldResolver $field_resolver
   *   The JSON:API field resolver.
   * @param \Symfony\Component\Serializer\SerializerInterface|\Symfony\Component\Serializer\Normalizer\DenormalizerInterface $serializer
   *   The JSON:API serializer.
   * @param \Drupal\Component\Datetime\TimeInterface $time
   *   The time service.
   * @param \Drupal\Core\Session\AccountInterface $user
   *   The current user account.
   * @param int $max_size
   *   The offset max size.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, EntityFieldManagerInterface $field_manager, ResourceTypeRepositoryInterface $resource_type_repository, RendererInterface $renderer, EntityRepositoryInterface $entity_repository, IncludeResolver $include_resolver, EntityAccessChecker $entity_access_checker, FieldResolver $field_resolver, SerializerInterface $serializer, TimeInterface $time, AccountInterface $user, int $max_size) {
    parent::__construct($entity_type_manager, $field_manager, $resource_type_repository, $renderer, $entity_repository, $include_resolver, $entity_access_checker, $field_resolver, $serializer, $time, $user);
    $this->maxSize = $max_size;
  }

  /**
   * {@inheritdoc}
   */
  protected function getJsonApiParams(Request $request, ResourceType $resource_type) {
    $params = parent::getJsonApiParams($request, $resource_type);
    if (!$request->query->has('fields')) {
      return $params;
    }

    // Increase the max size if path is requested as the first field.
    // We do this to overcome the max size limit when building paths for
    // getStaticPaths.
    // SPEC: https://jsonapi.org/format/#fetching-sparse-fieldsets
    $sparse_fieldset = array_map(function ($item) {
      return explode(',', $item);
    }, $request->query->get('fields'));

    if (!isset($sparse_fieldset[$resource_type->getTypeName()])) {
      return $params;
    }

    // We expect the first field to be path.
    // This is spec-compatible.
    if ($sparse_fieldset[$resource_type->getTypeName()][0] !== 'path') {
      return $params;
    }

    // Default to parameters.next_jsonapi.size_max.
    $max = $this->maxSize;

    // Fallback to page[limit] if set.
    if (($page = $request->query->get('page')) && isset($page['limit']) && $page['limit'] < $max) {
      $max = $page['limit'];
    }

    $params[OffsetPage::KEY_NAME] = new OffsetPage(OffsetPage::DEFAULT_OFFSET, $max);

    return $params;
  }

}
