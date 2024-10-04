<?php

namespace Drupal\Tests\next\Kernel\Plugin;

use Drupal\KernelTests\KernelTestBase;
use Drupal\next\CacheTagRevalidatorTaskStoreInterface;

/**
 * Tests the cache tag revalidator task store service.
 *
 * @coversDefaultClass \Drupal\next\CacheTagRevalidatorTaskStore
 *
 * @group next
 */
class CacheTagRevalidatorTaskStoreTest extends KernelTestBase {

  /**
   * The cache tag task store service.
   *
   * @var \Drupal\next\CacheTagRevalidatorTaskStoreInterface
   */
  protected $taskStore;

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
      CacheTagRevalidatorTaskStoreInterface::TABLE,
    ]);

    $this->taskStore = $this->container->get('next.cache_tag_revalidator_task_store');
  }

  /**
   * @covers ::set
   * @covers ::has
   * @covers ::delete
   */
  public function testTaskStore() {
    $this->taskStore->set([1, 2, 3], 'en', 'test');

    $this->assertTrue($this->taskStore->has(1, 'en', 'test'));
    $this->assertFalse($this->taskStore->has(1, 'nl', 'test'));
    $this->assertFalse($this->taskStore->has(1, 'en', 'test1'));
    $this->assertFalse($this->taskStore->has(4, 'en', 'test'));

    $this->taskStore->delete([1, 2], 'en', 'test');
    $this->assertFalse($this->taskStore->has(1, 'en', 'test'));
    $this->assertFalse($this->taskStore->has(2, 'en', 'test'));
    $this->assertTrue($this->taskStore->has(3, 'en', 'test'));
  }

}
