<?php

namespace Drupal\next;

use Drupal\Core\Database\Connection;

/**
 * Defines the cache tag revalidator task store service.
 */
class CacheTagRevalidatorTaskStore implements CacheTagRevalidatorTaskStoreInterface {

  /**
   * Database Service Object.
   *
   * @var \Drupal\Core\Database\Connection
   */
  private Connection $connection;

  /**
   * Construct the CacheTagRevalidatorTaskStore.
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
  public function set(array $nids, string $langcode, string $next_site): void {
    $query = $this->connection->insert(self::TABLE)
      ->fields(['nid', 'langcode', 'next_site']);
    foreach ($nids as $nid) {
      $query->values([
        'nid' => $nid,
        'langcode' => $langcode,
        'next_site' => $next_site,
      ]);
    }
    $query->execute();
  }

  /**
   * {@inheritdoc}
   */
  public function has(int $nid, string $langcode, string $next_site): bool {
    return (bool) $this->connection->select(self::TABLE, 'c')
      ->fields('c', ['nid'])
      ->condition('c.nid', $nid)
      ->condition('c.langcode', $langcode)
      ->condition('c.next_site', $next_site)
      ->execute()
      ->fetchField();
  }

  /**
   * {@inheritdoc}
   */
  public function delete(array $nids, string $langcode, string $next_site): void {
    $this->connection->delete(self::TABLE)
      ->condition('nid', $nids, 'IN')
      ->condition('langcode', $langcode)
      ->condition('next_site', $next_site)
      ->execute();
  }

}
