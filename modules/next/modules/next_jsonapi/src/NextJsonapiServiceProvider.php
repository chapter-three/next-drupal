<?php

namespace Drupal\next_jsonapi;

use Drupal\Core\DependencyInjection\ContainerBuilder;
use Drupal\Core\DependencyInjection\ServiceProviderBase;

/**
 * Modifies the jsonapi normalizer service.
 */
class NextJsonapiServiceProvider extends ServiceProviderBase {

  /**
   * {@inheritdoc}
   */
  public function alter(ContainerBuilder $container) {
    /** @var \Symfony\Component\DependencyInjection\Definition $definition */

    if ($container->hasDefinition('jsonapi.entity_resource')) {
      $definition = $container->getDefinition('jsonapi.entity_resource');
      $definition->setClass('Drupal\next_jsonapi\Controller\EntityResource');
    }
  }

}
