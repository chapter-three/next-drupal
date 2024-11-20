<?php

namespace Drupal\next;

use Drupal\Core\Database\Connection;

/**
 * Defines the cache tag node mapper service.
 */
class CacheTagNodeMapper implements CacheTagNodeMapperInterface {

  /**
   * Database Service Object.
   *
   * @var \Drupal\Core\Database\Connection
   */
  private Connection $connection;

  /**
   * Construct the CacheTagNodeMapper.
   *
   * @param \Drupal\Core\Database\Connection $connection
   *   The database connection.
   */
  public function __construct(Connection $connection) {
    $this->connection = $connection;
  }

  /**
   * {@inheritdoc}
   */
  public function getCacheTagsByNid(int $nid, string $langcode, string $next_site): array {
    return $this->connection->select(self::TABLE, 'c')
      ->fields('c', ['tag'])
      ->condition('c.nid', $nid)
      ->condition('c.langcode', $langcode)
      ->condition('c.next_site', $next_site)
      ->execute()
      ->fetchCol();
  }

  /**
   * {@inheritdoc}
   */
  public function getNidsByCacheTag(string $cache_tag, string $langcode, $next_site): array {
    return $this->connection->select(self::TABLE, 'c')
      ->fields('c', ['nid'])
      ->condition('c.tag', $cache_tag)
      ->condition('c.langcode', $langcode)
      ->condition('c.next_site', $next_site)
      ->distinct()
      ->execute()
      ->fetchCol();
  }

  /**
   * {@inheritdoc}
   */
  public function delete(array $cache_tags, string $langcode, ?int $nid = NULL, ?string $next_site = NULL): void {
    $query = $this->connection->delete(self::TABLE)
      ->condition('langcode', $langcode);

    if (count($cache_tags) > 1) {
      $query->condition('tag', $cache_tags, 'IN');
    }
    else {
      $query->condition('tag', reset($cache_tags));
    }

    if ($nid) {
      $query->condition('nid', $nid);
    }
    if ($next_site) {
      $query->condition('next_site', $next_site);
    }

    $query->execute();
  }

  /**
   * {@inheritdoc}
   */
  public function add(array $values): void {
    $query = $this->connection->insert(self::TABLE)
      ->fields(['tag', 'nid', 'langcode', 'next_site']);
    foreach ($values as $row) {
      $query->values($row);
    }
    $query->execute();
  }

}
