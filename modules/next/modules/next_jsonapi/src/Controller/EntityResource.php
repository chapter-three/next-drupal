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
   * Sets the offset max size.
   *
   * @param int $maxSize
   *   The offset max size.
   *
   * @return $this
   */
  public function setMaxSize(int $maxSize): static {
    $this->maxSize = $maxSize;
    return $this;
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
