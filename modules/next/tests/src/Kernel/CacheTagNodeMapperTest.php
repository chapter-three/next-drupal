<?php

namespace Drupal\Tests\next\Kernel\Plugin;

use Drupal\KernelTests\KernelTestBase;
use Drupal\next\CacheTagNodeMapperInterface;

/**
 * Tests the cache tag node mapper service.
 *
 * @coversDefaultClass \Drupal\next\CacheTagNodeMapper
 *
 * @group next
 */
class CacheTagNodeMapperTest extends KernelTestBase {

  /**
   * The cache tag node mapper service.
   *
   * @var \Drupal\next\CacheTagNodeMapperInterface
   */
  protected $cacheTagNodeMapper;

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'next',
  ];

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    $this->installSchema('next', [
      CacheTagNodeMapperInterface::TABLE,
    ]);

    $this->cacheTagNodeMapper = $this->container->get('next.cache_tag_node_mapper');

    $this->cacheTagNodeMapper->add([
      ['node:1', 1, 'en', 'test'],
      ['node:2', 1, 'nl', 'test'],
      ['node:3', 1, 'en', 'test1'],
      ['node:4', 2, 'en', 'test'],
      ['taxonomy_term:1', 1, 'en', 'test'],
      ['taxonomy_term:2', 1, 'nl', 'test'],
      ['taxonomy_term:3', 1, 'en', 'test1'],
      ['taxonomy_term:4', 2, 'en', 'test'],
    ]);
  }

  /**
   * @covers ::getCacheTagsByNid
   */
  public function testGetCacheTagsByNid() {
    $this->assertEquals(
      ['node:1', 'taxonomy_term:1'],
      $this->cacheTagNodeMapper->getCacheTagsByNid(1, 'en', 'test')
    );
    $this->assertEquals(
      ['node:4', 'taxonomy_term:4'],
      $this->cacheTagNodeMapper->getCacheTagsByNid(2, 'en', 'test')
    );
    $this->assertEquals(
      ['node:2', 'taxonomy_term:2'],
      $this->cacheTagNodeMapper->getCacheTagsByNid(1, 'nl', 'test')
    );
    $this->assertEquals(
      ['node:3', 'taxonomy_term:3'],
      $this->cacheTagNodeMapper->getCacheTagsByNid(1, 'en', 'test1')
    );
  }

  /**
   * @covers ::getNidsByCacheTag
   */
  public function testGetNidsByCacheTag() {
    $this->assertEquals(
      [1],
      $this->cacheTagNodeMapper->getNidsByCacheTag('node:1', 'en', 'test')
    );
    $this->assertEquals(
      [1],
      $this->cacheTagNodeMapper->getNidsByCacheTag('node:2', 'nl', 'test')
    );
    $this->assertEquals(
      [1],
      $this->cacheTagNodeMapper->getNidsByCacheTag('node:3', 'en', 'test1')
    );
    $this->assertEquals(
      [2],
      $this->cacheTagNodeMapper->getNidsByCacheTag('node:4', 'en', 'test')
    );
    $this->assertEquals(
      [1],
      $this->cacheTagNodeMapper->getNidsByCacheTag('taxonomy_term:1', 'en', 'test')
    );
    $this->assertEquals(
      [1],
      $this->cacheTagNodeMapper->getNidsByCacheTag('taxonomy_term:2', 'nl', 'test')
    );
    $this->assertEquals(
      [1],
      $this->cacheTagNodeMapper->getNidsByCacheTag('taxonomy_term:3', 'en', 'test1')
    );
    $this->assertEquals(
      [2],
      $this->cacheTagNodeMapper->getNidsByCacheTag('taxonomy_term:4', 'en', 'test')
    );
  }

  /**
   * @covers ::delete
   */
  public function testDelete() {
    $this->cacheTagNodeMapper->add([
      ['node:5', 5, 'en', 'test'],
      ['node:6', 6, 'en', 'test'],
      ['node:7', 6, 'en', 'test'],
      ['node:8', 8, 'en', 'test'],
      ['node:8', 9, 'en', 'test'],
      ['node:8', 9, 'en', 'test1'],
    ]);

    // Single cache tag.
    $cache_tags = ['node:5'];
    $this->assertEquals(
      $cache_tags,
      $this->cacheTagNodeMapper->getCacheTagsByNid(5, 'en', 'test')
    );
    $this->cacheTagNodeMapper->delete($cache_tags, 'en');
    $this->assertEmpty($this->cacheTagNodeMapper->getCacheTagsByNid(5, 'en', 'test'));

    // Multiple cache tags.
    $cache_tags = ['node:6', 'node:7'];
    $this->assertEquals(
      $cache_tags,
      $this->cacheTagNodeMapper->getCacheTagsByNid(6, 'en', 'test')
    );
    $this->cacheTagNodeMapper->delete($cache_tags, 'en');
    $this->assertEmpty($this->cacheTagNodeMapper->getCacheTagsByNid(5, 'en', 'test'));

    // Single cache tag + specific nid.
    $cache_tags = ['node:8'];
    $this->assertEquals(
      $cache_tags,
      $this->cacheTagNodeMapper->getCacheTagsByNid(8, 'en', 'test')
    );
    $this->cacheTagNodeMapper->delete($cache_tags, 'en', 8);
    $this->assertEmpty($this->cacheTagNodeMapper->getCacheTagsByNid(8, 'en', 'test'));

    // Single cache tag + specific nid and next site.
    $cache_tags = ['node:8'];
    $this->assertEquals(
      $cache_tags,
      $this->cacheTagNodeMapper->getCacheTagsByNid(9, 'en', 'test1')
    );
    $this->cacheTagNodeMapper->delete($cache_tags, 'en', 9, 'test1');
    $this->assertEmpty($this->cacheTagNodeMapper->getCacheTagsByNid(8, 'en', 'test1'));
  }

}
