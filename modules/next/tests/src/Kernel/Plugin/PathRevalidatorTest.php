<?php

namespace Drupal\Tests\next\Kernel\Plugin;

use Drupal\KernelTests\KernelTestBase;
use Drupal\next\Entity\NextEntityTypeConfig;
use Drupal\next\Entity\NextSite;
use Drupal\Tests\node\Traits\NodeCreationTrait;
use GuzzleHttp\ClientInterface;
use GuzzleHttp\Psr7\Response as GuzzleResponse;
use Prophecy\PhpUnit\ProphecyTrait;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

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
      'id' => 'blog',
    ]);
    $blog_site->save();

    // Create entity type config.
    $entity_type_config = NextEntityTypeConfig::create([
      'id' => 'node.page',
      'preview_enabled' => TRUE,
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
    $this->container->get('kernel')->terminate(Request::create('/'), new Response());

    $client->request('GET', 'http://blog.com/api/revalidate?path=/node/2')->shouldBeCalled()->willReturn(new GuzzleResponse());
    $blog_site->setRevalidateUrl('http://blog.com/api/revalidate')->save();
    $page = $this->createNode();
    $page->save();
    $this->container->get('kernel')->terminate(Request::create('/'), new Response());

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

    $client->request('GET', 'http://marketing.com/api/revalidate?path=/node/3&secret=12345')->shouldBeCalled()->willReturn(new GuzzleResponse());
    $client->request('GET', 'http://blog.com/api/revalidate?path=/node/3')->shouldBeCalled()->willReturn(new GuzzleResponse());
    $page = $this->createNode();
    $page->save();
    $this->container->get('kernel')->terminate(Request::create('/'), new Response());

    $entity_type_config->setRevalidatorConfiguration('path', [
      'additional_paths' => "/\n/blog",
    ])->save();

    $client->request('GET', 'http://marketing.com/api/revalidate?path=/node/3&secret=12345')->shouldBeCalled()->willReturn(new GuzzleResponse());
    $client->request('GET', 'http://marketing.com/api/revalidate?path=/&secret=12345')->shouldBeCalled()->willReturn(new GuzzleResponse());
    $client->request('GET', 'http://marketing.com/api/revalidate?path=/blog&secret=12345')->shouldBeCalled()->willReturn(new GuzzleResponse());
    $client->request('GET', 'http://blog.com/api/revalidate?path=/node/3')->shouldBeCalled()->willReturn(new GuzzleResponse());
    $client->request('GET', 'http://blog.com/api/revalidate?path=/')->shouldBeCalled()->willReturn(new GuzzleResponse());
    $client->request('GET', 'http://blog.com/api/revalidate?path=/blog')->shouldBeCalled()->willReturn(new GuzzleResponse());
    $page = $this->createNode();
    $page->save();
    $this->container->get('kernel')->terminate(Request::create('/'), new Response());
  }

}
