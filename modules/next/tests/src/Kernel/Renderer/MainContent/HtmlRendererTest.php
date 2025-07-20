<?php

namespace Drupal\Tests\next\Kernel\Renderer\MainContent;

use Drupal\KernelTests\KernelTestBase;
use Drupal\next\Entity\NextEntityTypeConfig;
use Drupal\next\Entity\NextSite;
use Drupal\node\Entity\NodeType;
use Drupal\Tests\node\Traits\NodeCreationTrait;
use Drupal\Tests\user\Traits\UserCreationTrait;
use Symfony\Component\HttpFoundation\Request;

/**
 * Tests the HTMLRenderer for preview.
 *
 * @coversDefaultClass \Drupal\next\Render\MainContent\HtmlRenderer
 *
 * @group next
 */
class HtmlRendererTest extends KernelTestBase {

  use NodeCreationTrait, UserCreationTrait;

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
    $this->installConfig(['filter', 'next', 'system', 'user']);
    $this->installSchema('node', ['node_access']);
    $this->installSchema('user', ['users_data']);

    // Create page type.
    $page_type = NodeType::create([
      'type' => 'page',
      'label' => 'Page',
    ]);
    $page_type->save();

    $article_type = NodeType::create([
      'type' => 'article',
      'label' => 'Article',
    ]);
    $article_type->save();

    // Create NextSite entities.
    $blog = NextSite::create([
      'label' => 'Blog',
      'id' => 'blog',
      'base_url' => 'https://blog.com',
      'preview_url' => 'https://blog.com/api/preview',
      'preview_secret' => 'one',
      'site_previewer' => 'iframe',
      'site_previewer_configuration' => [
        'width' => '100%',
      ],
    ]);
    $blog->save();

    // Create entity type config.
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

    $this->setUpCurrentUser();
  }

  /**
   * @covers ::prepare
   */
  public function testPrepare() {
    $this->setCurrentUser($this->createUser(['access content']));

    $page = $this->createNode(['type' => 'page']);
    $request = Request::create($page->toUrl()->toString(), 'GET');
    $response = $this->container->get('http_kernel')->handle($request);
    $this->setRawContent($response->getContent());

    $preview_url = 'https://blog.com/api/preview?path=/node/1';
    $fields = $this->xpath("//iframe[contains(@src, '$preview_url')]");
    $this->assertCount(1, $fields);

    $article = $this->createNode(['type' => 'article']);
    $request = Request::create($article->toUrl()->toString(), 'GET');
    $response = $this->container->get('http_kernel')->handle($request);
    $this->setRawContent($response->getContent());

    $preview_url = 'https://blog.com/node/2';
    $fields = $this->xpath("//iframe[contains(@src, '$preview_url')]");
    $this->assertEmpty($fields);
  }

  /**
   * @covers ::prepare
   */
  public function testPrepareWithRedirectSitePreviewer() {
    // Test with redirect site previewer.
    $marketing = NextSite::create([
      'label' => 'Marketing',
      'id' => 'marketing',
      'base_url' => 'https://marketing.com',
      'preview_url' => 'https://marketing.com/api/preview',
      'preview_secret' => 'secret',
      'site_previewer' => 'redirect',
      'site_previewer_configuration' => [],
    ]);
    $marketing->save();

    // Create entity type config for articles to use the marketing site.
    $entity_type_config = NextEntityTypeConfig::create([
      'id' => 'node.article',
      'site_resolver' => 'site_selector',
      'configuration' => [
        'sites' => [
          'marketing' => 'marketing',
        ],
      ],
    ]);
    $entity_type_config->save();

    $this->setCurrentUser($this->createUser(['access content']));

    $article = $this->createNode(['type' => 'article']);
    $request = Request::create($article->toUrl()->toString(), 'GET');
    $response = $this->container->get('http_kernel')->handle($request);
    $this->setRawContent($response->getContent());

    // Check for redirect meta tag instead of iframe.
    $preview_url = 'https://marketing.com/api/preview?path=/node/2';
    $fields = $this->xpath("//meta[@http-equiv='refresh' and contains(@content, '$preview_url')]");
    $this->assertCount(1, $fields);

    // Should not have iframe.
    $fields = $this->xpath("//iframe");
    $this->assertEmpty($fields);
  }

  /**
   * @covers ::prepare
   */
  public function testPrepareWithFallbackToGlobalSettings() {
    // Test fallback to global settings when site doesn't have site_previewer set.
    $legacy_site = NextSite::create([
      'label' => 'Legacy',
      'id' => 'legacy',
      'base_url' => 'https://legacy.com',
      'preview_url' => 'https://legacy.com/api/preview',
      'preview_secret' => 'legacy',
      // No site_previewer or site_previewer_configuration set
    ]);
    $legacy_site->save();

    // Create entity type config for a test content type.
    NodeType::create([
      'type' => 'test',
      'label' => 'Test',
    ])->save();

    $entity_type_config = NextEntityTypeConfig::create([
      'id' => 'node.test',
      'site_resolver' => 'site_selector',
      'configuration' => [
        'sites' => [
          'legacy' => 'legacy',
        ],
      ],
    ]);
    $entity_type_config->save();

    $this->setCurrentUser($this->createUser(['access content']));

    $test_node = $this->createNode(['type' => 'test']);
    $request = Request::create($test_node->toUrl()->toString(), 'GET');
    $response = $this->container->get('http_kernel')->handle($request);
    $this->setRawContent($response->getContent());

    // Should fall back to global iframe setting.
    $preview_url = 'https://legacy.com/api/preview?path=/node/3';
    $fields = $this->xpath("//iframe[contains(@src, '$preview_url')]");
    $this->assertCount(1, $fields);
  }

}
