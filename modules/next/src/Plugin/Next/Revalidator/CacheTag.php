<?php

namespace Drupal\next\Plugin\Next\Revalidator;

use Drupal\Core\Config\Config;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Logger\LoggerChannelInterface;
use Drupal\Core\Queue\QueueInterface;
use Drupal\next\Event\EntityActionEvent;
use Drupal\next\NextSettingsManagerInterface;
use Drupal\next\Plugin\ConfigurableRevalidatorBase;
use Drupal\next\Plugin\RevalidatorInterface;
use Drupal\node\NodeInterface;
use Drupal\next\CacheTagNodeMapperInterface;
use Drupal\next\CacheTagRevalidatorTaskStoreInterface;
use Drupal\next\PathRevalidatorHelperInterface;
use GuzzleHttp\ClientInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a revalidator for cache tags.
 *
 * @Revalidator(
 *  id = "cache_tag",
 *  label = "Cache tag",
 *  description = "Cache tag on-demand revalidation."
 * )
 */
class CacheTag extends ConfigurableRevalidatorBase implements RevalidatorInterface {

  /**
   * The next settings config.
   *
   * @var \Drupal\Core\Config\Config
   */
  private Config $settingsConfig;

  /**
   * The cache tag node mapper service.
   *
   * @var \Drupal\next\CacheTagNodeMapperInterface
   */
  private CacheTagNodeMapperInterface $cacheTagNodeMapper;

  /**
   * The path revalidator helper service.
   *
   * @var \Drupal\next\PathRevalidatorHelperInterface
   */
  private PathRevalidatorHelperInterface $pathRevalidatorHelper;

  /**
   * The queue object.
   *
   * @var \Drupal\Core\Queue\QueueInterface
   */
  private QueueInterface $queue;

  /**
   * The cache tag revalidator task store service.
   *
   * @var \Drupal\next\CacheTagRevalidatorTaskStoreInterface
   */
  private CacheTagRevalidatorTaskStoreInterface $taskStore;

  /**
   * CacheTag constructor.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\next\NextSettingsManagerInterface $next_settings_manager
   *   The next settings manager.
   * @param \GuzzleHttp\ClientInterface $http_client
   *   The http client.
   * @param \Drupal\Core\Logger\LoggerChannelInterface $logger
   *   The logger.
   * @param \Drupal\Core\Config\Config $settings_config
   *   The next settings config.
   * @param \Drupal\next\CacheTagNodeMapperInterface $cache_tag_node_mapper
   *   The cache tag node mapper service.
   * @param \Drupal\next\PathRevalidatorHelperInterface $path_revalidator_helper
   *   The path revalidator helper service.
   * @param \Drupal\Core\Queue\QueueInterface $queue
   *   The queue object.
   * @param \Drupal\next\CacheTagRevalidatorTaskStoreInterface $task_store
   *   The cache tag revalidator task store service.
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    NextSettingsManagerInterface $next_settings_manager,
    ClientInterface $http_client,
    LoggerChannelInterface $logger,
    Config $settings_config,
    CacheTagNodeMapperInterface $cache_tag_node_mapper,
    PathRevalidatorHelperInterface $path_revalidator_helper,
    QueueInterface $queue,
    CacheTagRevalidatorTaskStoreInterface $task_store
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $next_settings_manager, $http_client, $logger);
    $this->settingsConfig = $settings_config;
    $this->cacheTagNodeMapper = $cache_tag_node_mapper;
    $this->pathRevalidatorHelper = $path_revalidator_helper;
    $this->queue = $queue;
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
      $container->get('next.settings.manager'),
      $container->get('http_client'),
      $container->get('logger.channel.next'),
      $container->get('config.factory')->get('next.settings'),
      $container->get('next.cache_tag_node_mapper'),
      $container->get('next.path_revalidator_helper'),
      $container->get('queue')->get('cache_tag_revalidator', TRUE),
      $container->get('next.cache_tag_revalidator_task_store')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {}

  /**
   * {@inheritdoc}
   */
  public function revalidate(EntityActionEvent $event): bool {
    $sites = $event->getSites();
    if (!count($sites)) {
      return FALSE;
    }

    $entity = $event->getEntity();
    $event_action = $event->getAction();
    $langcode = $entity->language()->getId();
    $queue_size = $this->settingsConfig->get('queue_size');

    foreach ($sites as $site) {
      $nids = [];
      foreach ($this->getCacheTagsToInvalidate($entity) as $cache_tag) {
        $nids = array_merge($nids, $this->cacheTagNodeMapper->getNidsByCacheTag($cache_tag, $langcode, $site->id()));
      }

      // If the event is triggered on a node, we revalidate the associated
      // node directly and remove it from the task store.
      if ($entity instanceof NodeInterface) {
        // Filter out the current node.
        $nids = array_filter($nids, function ($nid) use ($entity) {
          return $nid !== $entity->id();
        });

        $this->pathRevalidatorHelper->revalidatePath($event->getEntityUrl(), $site, $event_action);
        if ($this->taskStore->has($entity->id(), $langcode, $site->id())) {
          $this->taskStore->delete([$entity->id()], $langcode, $site->id());
        }
      }

      // If queue size is not available, we revalidate all associated nodes
      // directly.
      if (!$queue_size) {
        $this->pathRevalidatorHelper->revalidatePathByNodeIds($nids, $langcode, $site, $event_action);
        continue;
      }

      // Filter out the node id's that are already queued.
      $nids = array_filter($nids, function ($nid) use ($langcode, $site) {
        return !$this->taskStore->has($nid, $langcode, $site->id());
      });

      foreach (array_chunk($nids, $queue_size) as $order => $nids_chunk) {
        // If the queue is empty and we are dealing with the first array chunk,
        // the items get directly revalidated.
        if (!$this->queue->numberOfItems() && !$order) {
          $this->pathRevalidatorHelper->revalidatePathByNodeIds($nids_chunk, $langcode, $site, $event_action);
          continue;
        }

        $data = [
          'nids' => $nids_chunk,
          'langcode' => $langcode,
          'site' => $site,
          'event_action' => $event_action,
        ];
        $this->queue->createItem($data);
        $this->taskStore->set($nids_chunk, $langcode, $site->id());
      }
    }

    // On delete action remove associated cache tags.
    if ($event->getAction() === 'delete') {
      $this->cacheTagNodeMapper->delete($entity->getCacheTags(), $langcode);
    }

    return TRUE;
  }

  /**
   * The cache tags to invalidate for this entity.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity to retrieve cache tags from.
   *
   * @return string[]
   *   Set of list cache tags.
   */
  private function getCacheTagsToInvalidate(EntityInterface $entity) {
    $tags = $entity->getEntityType()->getListCacheTags();
    if ($entity->getEntityType()->hasKey('bundle')) {
      $tags[] = $entity->getEntityTypeId() . '_list:' . $entity->bundle();
    }
    return array_merge($entity->getCacheTags(), $tags);
  }

}
