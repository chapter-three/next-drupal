<?php

namespace Drupal\next\Plugin\QueueWorker;

use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Queue\QueueWorkerBase;
use Drupal\next\CacheTagRevalidatorTaskStoreInterface;
use Drupal\next\PathRevalidatorHelperInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Process a queue of nodes to revalidate.
 *
 * @QueueWorker(
 *   id = "cache_tag_revalidator",
 *   title = @Translation("Cache tag revalidator"),
 *   cron = {"time" = 60}
 * )
 */
class CacheTagRevalidator extends QueueWorkerBase implements ContainerFactoryPluginInterface {

  /**
   * The path revalidator helper service.
   *
   * @var \Drupal\next\PathRevalidatorHelperInterface
   */
  private PathRevalidatorHelperInterface $pathRevalidatorHelper;

  /**
   * The cache tag revalidator task store service.
   *
   * @var \Drupal\next\CacheTagRevalidatorTaskStoreInterface
   */
  private CacheTagRevalidatorTaskStoreInterface $taskStore;

  /**
   * Constructs a new class instance.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\next\PathRevalidatorHelperInterface $path_revalidator_helper
   *   The path revalidator helper service.
   * @param \Drupal\next\CacheTagRevalidatorTaskStoreInterface $task_store
   *   The cache tag revalidator task store service.
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    PathRevalidatorHelperInterface $path_revalidator_helper,
    CacheTagRevalidatorTaskStoreInterface $task_store
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->pathRevalidatorHelper = $path_revalidator_helper;
    $this->taskStore = $task_store;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('next.path_revalidor_helper'),
      $container->get('next.cache_tag_revalidator_task_store')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function processItem($data) {
    $this->pathRevalidatorHelper->revalidatePathByNodeIds(
      $data['nids'],
      $data['langcode'],
      $data['site'],
      $data['event_action']
    );
    $this->taskStore->delete(
      $data['nids'],
      $data['langcode'],
      $data['site']->id()
    );
  }

}
