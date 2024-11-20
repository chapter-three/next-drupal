<?php

namespace Drupal\next\EventSubscriber;

use Drupal\Core\Cache\CacheableResponseInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Language\LanguageInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\node\NodeInterface;
use Drupal\next\CacheTagNodeMapperInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Response subscriber that registers cache tags.
 *
 * @see \Drupal\rest\EventSubscriber\ResourceResponseSubscriber
 */
class ResourceResponseSubscriber implements EventSubscriberInterface {

  /**
   * The entity type manager service.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  private EntityTypeManagerInterface $entityTypeManager;

  /**
   * The language manager.
   *
   * @var \Drupal\Core\Language\LanguageManagerInterface
   */
  private LanguageManagerInterface $languageManager;

  /**
   * The cache tag node mapper service.
   *
   * @var \Drupal\next\CacheTagNodeMapperInterface
   */
  private CacheTagNodeMapperInterface $cacheTagNodeMapper;

  /**
   * Constructs a ResourceResponseSubscriber object.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager service.
   * @param \Drupal\Core\Language\LanguageManagerInterface $language_manager
   *   The language manager.
   * @param \Drupal\next\CacheTagNodeMapperInterface $cache_tag_node_mapper
   *   The cache tag node mapper service.
   */
  public function __construct(
    EntityTypeManagerInterface $entity_type_manager,
    LanguageManagerInterface $language_manager,
    CacheTagNodeMapperInterface $cache_tag_node_mapper
  ) {
    $this->entityTypeManager = $entity_type_manager;
    $this->languageManager = $language_manager;
    $this->cacheTagNodeMapper = $cache_tag_node_mapper;
  }

  /**
   * {@inheritdoc}
   *
   * @see \Drupal\rest\EventSubscriber\ResourceResponseSubscriber::getSubscribedEvents()
   * @see \Drupal\dynamic_page_cache\EventSubscriber\DynamicPageCacheSubscriber
   */
  public static function getSubscribedEvents(): array {
    // Run before the dynamic page cache subscriber (priority 100), so that
    // Dynamic Page Cache can cache flattened responses.
    $events[KernelEvents::RESPONSE][] = ['onResponse', 100];
    return $events;
  }

  /**
   * Retrieve cache tags from response and register them.
   *
   * @param \Symfony\Component\HttpKernel\Event\ResponseEvent $event
   *   The event to process.
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   */
  public function onResponse(ResponseEvent $event): void {
    $response = $event->getResponse();
    $request = $event->getRequest();
    $entity = $request->attributes->get('entity');
    $next_site = $request->headers->get('X-NextJS-Site');

    if (
      $request->getRequestFormat() !== 'api_json' ||
      $request->attributes->get('_controller') !== 'jsonapi.entity_resource:getIndividual' ||
      !$response instanceof CacheableResponseInterface ||
      !$entity instanceof NodeInterface ||
      empty($next_site) ||
      !$this->entityTypeManager->getStorage('next_site')->load($next_site)
    ) {
      return;
    }

    $langcode = $this->languageManager->getCurrentLanguage(LanguageInterface::TYPE_URL)->getId();

    // Filter cache tags from response with only enabled next entity types.
    $cache_tags = $this->filterCacheTagsByNextEntityTypes($response->getCacheableMetadata()->getCacheTags());

    // Get existing stored cache tags for the associated node.
    $existing_cache_tags = $this->cacheTagNodeMapper->getCacheTagsByNid($entity->id(), $langcode, $next_site);

    // Remove stored cache tags that are no longer active on the response.
    $delete_cache_tags = [];
    foreach ($existing_cache_tags as $cache_tag => $nid) {
      if (!in_array($cache_tag, $cache_tags)) {
        $delete_cache_tags[] = $cache_tag;
      }
    }
    if (!empty($delete_cache_tags)) {
      $this->cacheTagNodeMapper->delete($delete_cache_tags, $langcode, $entity->id(), $next_site);
    }

    // Add new cache tags.
    $rows = [];
    foreach ($cache_tags as $cache_tag) {
      if (!in_array($cache_tag, $existing_cache_tags)) {
        $rows[] = [
          'tag' => $cache_tag,
          'nid' => $entity->id(),
          'langcode' => $langcode,
          'next_site' => $next_site,
        ];
      }
    }
    if (!empty($rows)) {
      $this->cacheTagNodeMapper->add($rows);
    }
  }

  /**
   * Filter the cache tags by active next entity types.
   *
   * @param array $cache_tags
   *   The cache tags to filter.
   *
   * @return array
   *   Returns array with filtered cache tags.
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   */
  private function filterCacheTagsByNextEntityTypes(array $cache_tags): array {
    $storage = $this->entityTypeManager->getStorage('next_entity_type_config');
    /** @var \Drupal\next\Entity\NextEntityTypeConfigInterface[] $next_entity_types */
    $next_entity_types = $storage->loadByProperties([
      'status' => TRUE,
      'revalidator' => 'cache_tag',
    ]);

    // Collect enabled next entity types, mapped with bundles.
    $entity_type_id_bundle_map = [];
    foreach ($next_entity_types as $next_entity_type) {
      $id = explode('.', $next_entity_type->id());
      $entity_type_id_bundle_map[$id[0]][] = $id[1];
    }
    $entity_type_id_bundles_str = [];
    foreach ($entity_type_id_bundle_map as $entity_type_id => $bundles) {
      $entity_type_id_bundles_str[$entity_type_id] = implode('|', $bundles);
    }

    $filtered_cache_tags = [];
    foreach ($cache_tags as $cache_tag) {
      // Extract the first part of the cache tag, which is the entity type id.
      $cache_tag_parts = explode(':', $cache_tag);
      $entity_type_id = $cache_tag_parts[0];
      // Support entity list cache tags.
      if (strpos($entity_type_id, '_list')) {
        $entity_type_id = str_replace('_list', '', $entity_type_id);
      }
      // Check if entity type is enabled in next.
      if (array_key_exists($entity_type_id, $entity_type_id_bundles_str)) {
        $bundles_str = $entity_type_id_bundles_str[$entity_type_id];
        // Check for associated entity cache tags, including list cache tags.
        if (preg_match("/^$entity_type_id(?:_list|_list:(?:$bundles_str)|:[0-9]+)$/", $cache_tag)) {
          $filtered_cache_tags[] = $cache_tag;
        }
      }
    }

    return $filtered_cache_tags;
  }

}
