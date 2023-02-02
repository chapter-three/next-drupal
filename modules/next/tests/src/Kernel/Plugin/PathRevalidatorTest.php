<?php

namespace Drupal\Tests\next\Kernel\Plugin;

use Drupal\KernelTests\KernelTestBase;
use Drupal\next\Entity\NextEntityTypeConfig;
use Drupal\next\Entity\NextSite;
use Drupal\Tests\node\Traits\NodeCreationTrait;
use GuzzleHttp\ClientInterface;
use Prophecy\PhpUnit\ProphecyTrait;

/**
 * Tests the path revalidator plugin.
 *
 * @coversDefaultClass \Drupal\next\Plugin\Next\Revalidator\Path
 *
 * @group next
 */
class PathRevalidatorTest extends KernelTestBase {

  use NodeCreationTrait;
  use ProphecyTrait;

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
   * @covers ::revalidate
   */
  public function testRevalidate() {
    /** @var \GuzzleHttp\ClientInterface $client */
    $client = $this->prophesize(ClientInterface::class);
    $this->container->set('http_client', $client->reveal());

    $blog_site = NextSite::create([
      'id' => 'blog'
    ]);
    $blog_site->save();

    // Create entity type config.
    $entity_type_config = NextEntityTypeConfig::create([
      'id' => 'node.page',
      'site_resolver' => 'site_selector',
      'configuration' => [
        'sites' => [
          'blog' => 'blog',
        ],
      ],
      'revalidator' => 'path',
      'revalidator_configuration' => [
        'revalidate_page' => TRUE,
      ],
    ]);
    $entity_type_config->save();

    $client->request('GET', $this->any())->shouldNotBeCalled();
    $page = $this->createNode();
    $page->save();
    _drupal_shutdown_function();

    $client->request('GET', 'http://blog.com/api/revalidate?slug=/node/2')->shouldBeCalled();
    $blog_site->setRevalidateUrl('http://blog.com/api/revalidate')->save();
    $page = $this->createNode();
    $page->save();
    _drupal_shutdown_function();

    $marketing = NextSite::create([
      'id' => 'marketing',
      'revalidate_url' => 'http://marketing.com/api/revalidate',
      'revalidate_secret' => '12345',
    ]);
    $marketing->save();
    $entity_type_config->setSiteResolverConfiguration('site_selector', [
      'sites' => [
        'blog' => 'blog',
        'marketing' => 'marketing',
      ],
    ])->save();

    $client->request('GET', 'http://marketing.com/api/revalidate?slug=/node/3&secret=12345')->shouldBeCalled();
    $client->request('GET', 'http://blog.com/api/revalidate?slug=/node/3')->shouldBeCalled();
    $page = $this->createNode();
    $page->save();
    _drupal_shutdown_function();

    $entity_type_config->setRevalidatorConfiguration('path', [
      'additional_paths' => "/\n/blog"
    ])->save();

    $client->request('GET', 'http://marketing.com/api/revalidate?slug=/node/3&secret=12345')->shouldBeCalled();
    $client->request('GET', 'http://marketing.com/api/revalidate?slug=/&secret=12345')->shouldBeCalled();
    $client->request('GET', 'http://marketing.com/api/revalidate?slug=/blog&secret=12345')->shouldBeCalled();
    $client->request('GET', 'http://blog.com/api/revalidate?slug=/node/3')->shouldBeCalled();
    $client->request('GET', 'http://blog.com/api/revalidate?slug=/')->shouldBeCalled();
    $client->request('GET', 'http://blog.com/api/revalidate?slug=/blog')->shouldBeCalled();
    $page = $this->createNode();
    $page->save();
    _drupal_shutdown_function();
  }

}
