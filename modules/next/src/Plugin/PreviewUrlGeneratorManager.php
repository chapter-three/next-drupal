<?php

namespace Drupal\next\Plugin;

use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Plugin\DefaultPluginManager;
use Drupal\next\Annotation\PreviewUrlGenerator;

/**
 * Plugin manager for preview_url_generator plugins.
 */
class PreviewUrlGeneratorManager extends DefaultPluginManager implements PreviewUrlGeneratorManagerInterface {

  /**
   * PreviewUrlGeneratorManager constructor.
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
      'Plugin/Next/PreviewUrlGenerator',
      $namespaces,
      $module_handler,
      PreviewUrlGeneratorInterface::class,
      PreviewUrlGenerator::class
    );
    $this->alterInfo('next_preview_url_generator_info');
    $this->setCacheBackend($cache_backend, 'next_preview_url_generator_plugins');
  }

}
