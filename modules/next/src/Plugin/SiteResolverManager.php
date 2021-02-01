<?php

namespace Drupal\next\Plugin;

use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Plugin\DefaultPluginManager;
use Drupal\next\Annotation\SiteResolver;

/**
 * Plugin manager for site resolvers.
 */
class SiteResolverManager extends DefaultPluginManager implements SiteResolverManagerInterface {

  /**
   * SiteResolverManager constructor.
   *
   * @param \Traversable $namespaces
   *   An object that implements \Traversable which contains the root paths
   *   keyed by the corresponding namespace to look for plugin implementations.
   * @param \Drupal\Core\Cache\CacheBackendInterface $cache_backend
   *   Cache backend instance to use.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   The module handler to invoke the alter hook with.
   */
  public function __construct(\Traversable $namespaces, CacheBackendInterface $cache_backend, ModuleHandlerInterface $module_handler) {
    parent::__construct(
      'Plugin/Next/SiteResolver',
      $namespaces,
      $module_handler,
      SiteResolverInterface::class,
      SiteResolver::class
    );
    $this->alterInfo('next_site_resolver_info');
    $this->setCacheBackend($cache_backend, 'next_site_resolver_plugins');
  }

}
