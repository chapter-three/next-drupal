<?php

namespace Drupal\next;

/**
 * Cache tag node mapper interface.
 */
interface CacheTagNodeMapperInterface {

  /**
   * The table name.
   */
  const TABLE = 'cachetag_node_map';

  /**
   * Get cache tags by node id.
   *
   * @param int $nid
   *   The node id.
   * @param string $langcode
   *   The language code.
   * @param string $next_site
   *   The next site id.
   *
   * @return array
   *   Returns array with cache tags.
   */
  public function getCacheTagsByNid(int $nid, string $langcode, string $next_site): array;

  /**
   * Get node id's by cache tag.
   *
   * @param string $cache_tag
   *   The cache tag.
   * @param string $langcode
   *   The language code.
   * @param string $next_site
   *   The next site id.
   *
   * @return array
   *   Returns array with node id's.
   */
  public function getNidsByCacheTag(string $cache_tag, string $langcode, string $next_site): array;

  /**
   * Delete cache tags.
   *
   * @param array $cache_tags
   *   The cache tags.
   * @param string $langcode
   *   The language code.
   * @param int|null $nid
   *   Optional node id.
   * @param string|null $next_site
   *   Optional next site id.
   */
  public function delete(array $cache_tags, string $langcode, ?int $nid = NULL, ?string $next_site = NULL): void;

  /**
   * Add cache tags.
   *
   * @param array $values
   *   Cache tags values to add.
   *   E.g: [
   *     [
   *       'tag' => 'node:1',
   *       'nid' => '1',
   *       'langcode' => 'en',
   *       'next_site' => example,
   *     ]
   *   ].
   */
  public function add(array $values): void;

}
