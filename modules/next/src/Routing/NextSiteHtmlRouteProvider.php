<?php

namespace Drupal\next\Routing;

use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Entity\Routing\AdminHtmlRouteProvider;
use Drupal\next\Controller\NextSiteEntityController;
use Symfony\Component\Routing\Route;

/**
 * Provides HTML routes for next_site pages.
 */
class NextSiteHtmlRouteProvider extends AdminHtmlRouteProvider {

  /**
   * {@inheritdoc}
   */
  public function getRoutes(EntityTypeInterface $entity_type) {
    $collection = parent::getRoutes($entity_type);

    if ($environment_variables_page_route = $this->getEnvironmentVariablesRoute($entity_type)) {
      $collection->add("entity.next_site.environment_variables", $environment_variables_page_route);
    }

    return $collection;
  }

  /**
   * Gets the environment_variables page route.
   *
   * @param \Drupal\Core\Entity\EntityTypeInterface $entity_type
   *   The entity type.
   *
   * @return \Symfony\Component\Routing\Route|null
   *   The generated route, if available.
   */
  protected function getEnvironmentVariablesRoute(EntityTypeInterface $entity_type) {
    if (!$entity_type->hasLinkTemplate('environment-variables')) {
      return NULL;
    }

    $route = new Route($entity_type->getLinkTemplate('environment-variables'));
    $route->setDefault('_controller', NextSiteEntityController::class . '::environmentVariables');
    $route->setDefault('_title', 'Environment variables');
    $route->setRequirement('_permission', $entity_type->getAdminPermission());
    $route->setOption('_admin_route', TRUE);
    $route->setOption('parameters', [
      'next_site' => [
        'with_config_overrides' => TRUE,
      ],
    ]);

    return $route;
  }

}
