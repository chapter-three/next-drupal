<?php

namespace Drupal\next;

use Drupal\Core\DependencyInjection\ContainerBuilder;
use Drupal\Core\DependencyInjection\ServiceModifierInterface;

/**
 * Enable CORS by default.
 *
 * @see https://github.com/contentacms/contenta_jsonapi/blob/8.x-3.x/modules/contenta_enhancements/src/ContentaEnhancementsServiceProvider.php.
 */
class NextServiceProvider implements ServiceModifierInterface {

  /**
   * {@inheritdoc}
   */
  public function alter(ContainerBuilder $container) {
    $cors_config = $container->getParameter('cors.config');
    if (!$cors_config['enabled']) {
      $cors_config['enabled'] = TRUE;
      $container->setParameter('cors.config', $cors_config);
    }
  }

}
