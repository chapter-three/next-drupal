<?php

namespace Drupal\next_jsonapi\Controller;

use Drupal\jsonapi\Controller\EntityResource as JsonApiEntityResource;
use Drupal\jsonapi\Query\OffsetPage;
use Drupal\jsonapi\ResourceType\ResourceType;
use Symfony\Component\HttpFoundation\Request;

/**
 * Process all entity requests.
 */
class EntityResource extends JsonApiEntityResource {

  /**
   * The offset max size.
   *
   * @var int
   */
  protected int $maxSize;

  /**
   * EntityResource constructor.
   *
   * @param mixed ...$args
   *   All constructor arguments.
   */
  public function __construct(...$args) {
    // Pop the last argument as $maxSize.
    $this->maxSize = array_pop($args);

    // Forward the remaining arguments to the parent constructor.
    // We handle it this way because the parent constructor arguments
    // differ between Drupal 10 and Drupal 11, so using ...$args
    // ensures compatibility across versions.
    parent::__construct(...$args);
  }

  /**
   * {@inheritdoc}
   */
  protected function getJsonApiParams(Request $request, ResourceType $resource_type) {
    $params = parent::getJsonApiParams($request, $resource_type);
    if (!$request->query->has('fields')) {
      return $params;
    }

    $query = $request->query->all();

    // Increase the max size if path is requested as the first field.
    // We do this to overcome the max size limit when building paths for
    // getStaticPaths.
    // SPEC: https://jsonapi.org/format/#fetching-sparse-fieldsets
    $sparse_fieldset = array_map(function ($item) {
      return explode(',', $item);
    }, $query['fields']);

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
    if (isset($query['page']) && ($page = $query['page']) && isset($page['limit']) && $page['limit'] < $max) {
      $max = $page['limit'];
    }

    $params[OffsetPage::KEY_NAME] = new OffsetPage($page['offset'] ?? OffsetPage::DEFAULT_OFFSET, $max);

    return $params;
  }

}
