<?php

namespace Drupal\Tests\next\Kernel\Plugin;

use Drupal\KernelTests\KernelTestBase;
use Drupal\Tests\node\Traits\NodeCreationTrait;

/**
 * Tests the path revalidator plugin.
 *
 * @coversDefaultClass \Drupal\next\Plugin\Next\Revalidator\Path
 *
 * @group next
 */
class PathRevalidatorTest extends KernelTestBase {

  use NodeCreationTrait;

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'filter',
    'next',
    'node',
    'system',
    'user',
    'path',
    'path_alias',
  ];

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    $this->installEntitySchema('node');
    $this->installEntitySchema('user');
    $this->installEntitySchema('path_alias');
    $this->installConfig(['filter']);
    $this->installSchema('system', ['sequences']);
    $this->installSchema('node', ['node_access']);
  }

  /**
   * @covers ::getPathsForEntity
   */
  public function testGetPathForEntity() {
    /** @var \Drupal\next\Plugin\RevalidatorManagerInterface $plugin_manager */
    $plugin_manager = $this->container->get('plugin.manager.next.revalidator');
    /** @var \Drupal\next\Plugin\Next\Revalidator\Path $revalidator */
    $revalidator = $plugin_manager->createInstance('path');

    $page = $this->createNode();
    $this->assertEmpty($revalidator->getPathsForEntity($page));

    $revalidator->setConfiguration(['revalidate_page' => TRUE]);
    $this->assertSame(['/node/1'], $revalidator->getPathsForEntity($page));

    $revalidator->setConfiguration(['revalidate_page' => FALSE]);
    $this->assertEmpty($revalidator->getPathsForEntity($page));

    $revalidator->setConfiguration(['additional_paths' => "/about"]);
    $this->assertSame(['/about'], $revalidator->getPathsForEntity($page));

    $revalidator->setConfiguration(['additional_paths' => "/about\n/articles"]);
    $this->assertSame([
      '/about',
      '/articles',
    ], $revalidator->getPathsForEntity($page));

    $revalidator->setConfiguration([
      'revalidate_page' => TRUE,
      'additional_paths' => "/about\n/articles",
    ]);
    $this->assertSame([
      '/node/1',
      '/about',
      '/articles',
    ], $revalidator->getPathsForEntity($page));
  }

}
