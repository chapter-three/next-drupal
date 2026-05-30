<?php

namespace Drupal\Tests\next\Kernel\Plugin;

use Drupal\KernelTests\KernelTestBase;
use Drupal\next\Entity\NextEntityTypeConfig;
use Drupal\next\Entity\NextSite;
use Drupal\node\Entity\NodeType;
use Drupal\Tests\node\Traits\NodeCreationTrait;
use Drupal\Tests\user\Traits\UserCreationTrait;

/**
 * Tests the site_resolver plugin.
 *
 * @coversDefaultClass \Drupal\next\Plugin\Next\SiteResolver\SiteSelector
 *
 * @group next
 */
class SiteResolverTest extends KernelTestBase {

  use NodeCreationTrait;
  use UserCreationTrait;

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
    $this->installConfig(['filter']);
    $this->installSchema('node', ['node_access']);

    // Create content types.
    NodeType::create(['type' => 'page', 'name' => 'Page'])->save();
    NodeType::create(['type' => 'article', 'name' => 'Article'])->save();

    // Create NextSite entities.
    $blog = NextSite::create([
      'label' => 'Blog',
      'id' => 'blog',
      'base_url' => 'https://blog.com',
      'preview_url' => 'https://blog.com/api/preview',
      'preview_secret' => 'one',
    ]);
    $blog->save();

    $marketing = NextSite::create([
      'label' => 'Marketing',
      'id' => 'marketing',
      'base_url' => 'https://marketing.com',
      'preview_url' => 'https://marketing.com/api/preview',
      'preview_secret' => 'two',
    ]);
    $marketing->save();

    // Create entity type config.
    $entity_type_config = NextEntityTypeConfig::create([
      'id' => 'node.page',
      'draft_enabled' => TRUE,
      'site_resolver' => 'site_selector',
      'configuration' => [
        'sites' => [
          'blog' => 'blog',
          'marketing' => 'marketing',
        ],
      ],
    ]);
    $entity_type_config->save();
  }

  /**
   * @covers ::getSitesForEntity
   */
  public function testGetSitesForEntity() {
    $page = $this->createNode(['type' => 'page']);

    /** @var \Drupal\next\NextEntityTypeManagerInterface $next_entity_type_manager */
    $next_entity_type_manager = $this->container->get('next.entity_type.manager');
    $next_entity_type_config = $next_entity_type_manager->getConfigForEntityType($page->getEntityTypeId(), $page->bundle());
    $site_resolver = $next_entity_type_config->getSiteResolver();

    $this->assertEquals('site_selector', $site_resolver->getId());

    $sites = $site_resolver->getSitesForEntity($page);
    $this->assertSame(['blog', 'marketing'], array_keys($sites));

    $article = $this->createNode(['type' => 'article']);
    $next_entity_type_config = $next_entity_type_manager->getConfigForEntityType($article->getEntityTypeId(), $article->bundle());
    $this->assertNull($next_entity_type_config);

    $account1 = $this->createUser();
    $account2 = $this->createUser();
    $page->setOwner($account1)->save();
    $article->setOwner($account2)->save();
    $next_entity_type_config = $next_entity_type_manager->getConfigForEntityType($page->getEntityTypeId(), $page->bundle())
      ->setSiteResolver('entity_owner')
      ->set('configuration', [
        'sites' => [
          'blog' => [$account1->uuid()],
        ],
      ]);
    $next_entity_type_config->save();
    $site_resolver = $next_entity_type_config->getSiteResolver();
    $sites = array_keys($site_resolver->getSitesForEntity($page));
    $this->assertSame(['blog'], $sites);

    $next_entity_type_config = NextEntityTypeConfig::create([
      'id' => 'node.article',
      'site_resolver' => 'entity_owner',
      'configuration' => [
        'sites' => [
          'blog' => [$account2->uuid()],
          'marketing' => [$account1->uuid(), $account2->uuid()],
        ],
      ],
    ]);
    $next_entity_type_config->save();
    $site_resolver = $next_entity_type_config->getSiteResolver();
    $sites = array_keys($site_resolver->getSitesForEntity($article));
    $this->assertEquals(['blog', 'marketing'], $sites);
  }

}
