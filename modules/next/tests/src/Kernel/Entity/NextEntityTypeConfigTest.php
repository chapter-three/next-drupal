<?php

namespace Drupal\Tests\next\Kernel\Plugin;

use Drupal\KernelTests\KernelTestBase;
use Drupal\next\Entity\NextEntityTypeConfig;
use Drupal\next\Entity\NextSite;
use Drupal\node\Entity\Node;
use Drupal\path_alias\Entity\PathAlias;
use Drupal\Tests\node\Traits\NodeCreationTrait;

/**
 * Tests the next_entity_type_config entity.
 *
 * @coversDefaultClass \Drupal\next\Entity\NextEntityTypeConfig
 *
 * @group next
 */
class NextEntityTypeConfigTest extends KernelTestBase {

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
   * Tests.
   *
   * @coversClass \Drupal\next\Entity\NextEntityTypeConfig
   */
  public function test() {
    // Create entity type config.
    $entity_type_config = NextEntityTypeConfig::create([
      'id' => 'node.page',
      'site_resolver' => 'site_selector',
      'configuration' => [
        'sites' => [
          'blog' => 'blog',
          'marketing' => 'marketing',
        ],
      ],
    ]);
    $entity_type_config->save();

    $this->assertSame('site_selector', $entity_type_config->getSiteResolver()
      ->getId());
    $this->assertFalse($entity_type_config->getRevalidate());
    $this->assertFalse($entity_type_config->getRevalidatePage());

    $entity_type_config->setRevalidate(TRUE);
    $this->assertTrue($entity_type_config->getRevalidate());
  }

  /**
   * Tests revalidate paths.
   */
  public function testGetRevalidatePathsForEntity() {
    $page = $this->createNode();
    $page->save();

    $entity_type_config = NextEntityTypeConfig::create([
      'id' => 'node.page',
      'site_resolver' => 'site_selector',
      'configuration' => [
        'sites' => [
          'blog' => 'blog',
          'marketing' => 'marketing',
        ],
      ],
    ]);
    $entity_type_config->save();

    $this->assertEmpty($entity_type_config->getRevalidatePathsForEntity($page));

    $entity_type_config->setRevalidatePaths("/\r\n/pages\r\n/about")->save();
    $this->assertSame([
      '/',
      '/pages',
      '/about',
    ], $entity_type_config->getRevalidatePathsForEntity($page));

    $entity_type_config->setRevalidatePaths("/\n/pages\n/about")->save();
    $this->assertSame([
      '/',
      '/pages',
      '/about',
    ], $entity_type_config->getRevalidatePathsForEntity($page));

    $entity_type_config->setRevalidatePage(TRUE)->save();
    $this->assertSame([
      '/node/1',
      '/',
      '/pages',
      '/about',
    ], $entity_type_config->getRevalidatePathsForEntity($page));
  }

}
