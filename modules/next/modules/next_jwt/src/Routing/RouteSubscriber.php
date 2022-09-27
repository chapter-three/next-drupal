<?php

namespace Drupal\next_jwt\Routing;

use Drupal\Core\Routing\RouteSubscriberBase;
use Symfony\Component\Routing\RouteCollection;

/**
 * Route subscriber for next_jwt.
 */
class RouteSubscriber extends RouteSubscriberBase {

  /**
   * {@inheritdoc}
   */
  protected function alterRoutes(RouteCollection $collection) {
    $route_names = [
      'decoupled_router.path_translation',
      'subrequests.front-controller',
    ];

    foreach ($route_names as $name) {
      if ($route = $collection->get($name)) {
        // Add the jwt_auth to _auth.
        $auth = $route->getOption('_auth');
        $auth[] = 'jwt_auth';
        $route->setOption('_auth', $auth);
      }
    }
  }

}
