<?php

namespace Drupal\Tests\next\Kernel\Plugin;

use Drupal\KernelTests\KernelTestBase;
use Drupal\next\Entity\NextEntityTypeConfig;
use Drupal\next\Entity\NextSite;
use Drupal\next\Plugin\Next\PreviewUrlGenerator\SimpleOauth;
use Drupal\next\Plugin\Next\SitePreviewer\Iframe;
use Drupal\Tests\node\Traits\NodeCreationTrait;

/**
 * Tests the next.entity_type.manager service.
 *
 * @coversDefaultClass \Drupal\next\NextEntityTypeManager
 *
 * @group next
 */
class NextEntityTypeManagerTest extends KernelTestBase {

  use NodeCreationTrait;

  /**
   * {@inheritdoc}
   */
  protected static $modules = ['filter', 'next', 'node', 'system', 'user'];

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    $this->installEntitySchema('node');
    $this->installEntitySchema('user');
    $this->installConfig(['filter', 'next']);
    $this->installSchema('system', ['sequences']);
    $this->installSchema('node', ['node_access']);
  }

  /**
   * @covers ::getSitesForEntity
   */
  public function testGetSitesForEntity() {
    $next_entity_type_manager = $this->container->get('next.entity_type.manager');

    $page = $this->createNode();
    $this->assertEmpty($next_entity_type_manager->getSitesForEntity($page));

    $blog_site = NextSite::create([
      'id' => 'blog'
    ]);
    $blog_site->save();
    $this->assertEmpty($next_entity_type_manager->getSitesForEntity($page));

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
    $sites = $next_entity_type_manager->getSitesForEntity($page);
    $this->assertCount(1, $sites);
    $site = reset($sites);
    $this->assertSame('blog', $site->id());

    $marketing = NextSite::create([
      'id' => 'marketing',
    ]);
    $marketing->save();
    $this->assertCount(1, $next_entity_type_manager->getSitesForEntity($page));

    $entity_type_config->setSiteResolverConfiguration('site_selector', [
      'sites' => [
        'blog' => 'blog',
        'marketing' => 'marketing',
      ],
    ])->save();
    $this->assertCount(2, $next_entity_type_manager->getSitesForEntity($page));
  }

  /**
   * @covers ::getSiteResolver
   */
  public function testGetSiteResolver() {
    $next_entity_type_manager = $this->container->get('next.entity_type.manager');

    $page = $this->createNode();
    $this->assertEmpty($next_entity_type_manager->getSiteResolver($page));

    $blog_site = NextSite::create([
      'id' => 'blog'
    ]);
    $blog_site->save();
    $this->assertEmpty($next_entity_type_manager->getSiteResolver($page));

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
    $site_resolver = $next_entity_type_manager->getSiteResolver($page);
    $this->assertSame('site_selector', $site_resolver->getId());
  }

  /**
   * @covers ::getRevalidator
   */
  public function testGetRevalidator() {
    $next_entity_type_manager = $this->container->get('next.entity_type.manager');

    $page = $this->createNode();
    $this->assertEmpty($next_entity_type_manager->getRevalidator($page));

    $entity_type_config = NextEntityTypeConfig::create([
      'id' => 'node.page',
      'site_resolver' => 'site_selector',
      'configuration' => [
        'sites' => [
          'blog' => 'blog',
        ],
      ],
      'revalidator' => 'path',
      'revalidator_configuration' => [],
    ]);
    $entity_type_config->save();
    $site_resolver = $next_entity_type_manager->getRevalidator($page);
    $this->assertSame('path', $site_resolver->getId());
  }

}
