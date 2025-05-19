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
   * The next entity type config.
   *
   * @var \Drupal\next\Entity\NextEntityTypeConfigInterface
   */
  protected $entityTypeConfig;

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
    ]);
    $blog->save();

    // Create entity type config.
    $this->entityTypeConfig = NextEntityTypeConfig::create([
      'id' => 'node.page',
      'draft_enabled' => TRUE,
      'site_resolver' => 'site_selector',
      'configuration' => [
        'sites' => [
          'blog' => 'blog',
        ],
      ],
    ]);
    $this->entityTypeConfig->save();

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

    // Disable preview.
    $this->entityTypeConfig->set('draft_enabled', FALSE);
    $this->entityTypeConfig->save();
    $request = Request::create($page->toUrl()->toString(), 'GET');
    $response = $this->container->get('http_kernel')->handle($request);
    $this->setRawContent($response->getContent());

    $fields = $this->xpath("//iframe");
    $this->assertEmpty($fields);
  }

}
