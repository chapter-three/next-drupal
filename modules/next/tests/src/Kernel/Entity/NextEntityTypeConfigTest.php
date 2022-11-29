<?php

namespace Drupal\Tests\next\Kernel\Plugin;

use Drupal\KernelTests\KernelTestBase;
use Drupal\next\Entity\NextEntityTypeConfig;
use Drupal\next\Entity\NextSite;
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
   * Tests the site resolver.
   *
   * @coversClass \Drupal\next\Entity\NextEntityTypeConfig
   */
  public function testSiteResolver() {
    $blog_site = NextSite::create([
      'id' => 'blog'
    ]);
    $blog_site->save();

    // Create entity type config.
    /** @var \Drupal\next\Entity\NextEntityTypeConfigInterface $entity_type_config */
    $entity_type_config = NextEntityTypeConfig::create([
      'id' => 'node.page',
      'site_resolver' => 'site_selector',
      'configuration' => [
        'sites' => [
          'blog' => 'blog',
        ],
      ],
    ]);
    $entity_type_config->save();

    $site_resolver = $entity_type_config->getSiteResolver();
    $this->assertSame('site_selector', $site_resolver->getId());
    $this->assertSame([
      'sites' => [
        'blog' => 'blog',
      ],
    ], $entity_type_config->getConfiguration());
    $this->assertSame([
      'sites' => [
        'blog' => 'blog',
      ],
    ], $entity_type_config->getSiteResolverConfiguration());
    $page = $this->createNode(['type' => 'page']);
    $page->save();
    $this->assertSame(['blog'], array_keys($site_resolver->getSitesForEntity($page)));

    $entity_type_config->setSiteResolverConfiguration('site_selector', [
      'sites' => [
        'blog' => 'blog',
        'marketing' => 'marketing',
      ],
    ])->save();
    $this->assertSame([
      'sites' => [
        'blog' => 'blog',
        'marketing' => 'marketing',
      ],
    ], $entity_type_config->getSiteResolverConfiguration());
    $this->assertSame(['blog'], array_keys($site_resolver->getSitesForEntity($page)));

    NextSite::create([
      'id' => 'marketing',
    ])->save();
    $this->assertSame(['blog', 'marketing'], array_keys($site_resolver->getSitesForEntity($page)));
  }

  /**
   * Tests the revalidator plugin.
   *
   * @covers ::getRevalidator
   * @covers ::setRevalidator
   * @covers ::getRevalidatorConfiguration
   * @covers ::setRevalidatorConfiguration
   * @covers ::getRevalidatorPluginCollection
   */
  public function testRevalidator() {
    $blog_site = NextSite::create([
      'id' => 'blog'
    ]);
    $blog_site->save();

    // Create entity type config.
    /** @var \Drupal\next\Entity\NextEntityTypeConfigInterface $entity_type_config */
    $entity_type_config = NextEntityTypeConfig::create([
      'id' => 'node.page',
      'site_resolver' => 'site_selector',
      'configuration' => [
        'sites' => [
          'blog' => 'blog',
        ],
      ],
    ]);
    $entity_type_config->save();
    $this->assertNull($entity_type_config->getRevalidator());

    $entity_type_config->setRevalidator('path')->save();

    $revalidator = $entity_type_config->getRevalidator();
    $this->assertSame('path', $revalidator->getId());
  }

}
