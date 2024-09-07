<?php

namespace Drupal\next;

/**
 * Cache tag node mapper interface.
 */
interface CacheTagRevalidatorTaskStoreInterface {

  /**
   * The table name.
   */
  const TABLE = 'cachetag_revalidator_task_store';

  /**
   * Saves a cache tag revalidator task item.
   *
   * @param array $nids
   *   The node id's.
   * @param string $langcode
   *   The langcode.
   * @param string $next_site
   *   The next site id.
   */
  public function set(array $nids, string $langcode, string $next_site): void;

  /**
   * Checks if a cache tag revalidator task item exist.
   *
   * @param int $nid
   *   The node id.
   * @param string $langcode
   *   The langcode.
   * @param string $next_site
   *   The next site id.
   *
   * @return bool
   *   Return true or false.
   */
  public function has(int $nid, string $langcode, string $next_site): bool;

  /**
   * Delete cache tag revalidator task items.
   *
   * @param array $nids
   *   The node id's.
   * @param string $langcode
   *   The langcode.
   * @param string $next_site
   *   The next site id.
   */
  public function delete(array $nids, string $langcode, string $next_site): void;

}
