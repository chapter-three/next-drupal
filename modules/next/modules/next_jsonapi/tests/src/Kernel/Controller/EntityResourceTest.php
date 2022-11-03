<?php

namespace Drupal\Tests\next_jsonapi\Kernel\Controller;

use Drupal\Core\DependencyInjection\ContainerBuilder;
use Drupal\KernelTests\KernelTestBase;
use Drupal\node\Entity\NodeType;
use Drupal\Tests\node\Traits\NodeCreationTrait;
use Drupal\Tests\user\Traits\UserCreationTrait;
use Drupal\user\Entity\User;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Request;

/**
 * @coversDefaultClass \Drupal\next_jsonapi\Controller\EntityResource
 *
 * @group next
 */
class EntityResourceTest extends KernelTestBase {

  use NodeCreationTrait, UserCreationTrait;

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'filter',
    'next',
    'node',
    'field',
    'system',
    'user',
    'jsonapi',
    'path',
    'serialization',
  ];

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

    $type = NodeType::create([
      'type' => 'article',
    ]);
    $type->save();

    foreach (range(1, 100) as $number) {
      $article = $this->createNode([
        'title' => "Article $number",
        'type' => 'article',
      ]);
      $article->save();
    }

    $this->setCurrentUser(User::load(1));
  }

  /**
   * {@inheritdoc}
   */
  public function register(ContainerBuilder $container) {
    parent::register($container);
    $container->setParameter('next_jsonapi.size_max', 60);
    if ($container->hasDefinition('jsonapi.entity_resource')) {
      $definition = $container->getDefinition('jsonapi.entity_resource');
      $definition->setClass('Drupal\next_jsonapi\Controller\EntityResource')
        ->addArgument('%next_jsonapi.size_max%');
    }
  }

  /**
   * Tests the page limit.
   *
   * @covers ::getJsonApiParams
   */
  public function testPageLimit() {
    /** @var \Drupal\next_jsonapi\Controller\EntityResource $entity_resource */
    $entity_resource = $this->container->get('jsonapi.entity_resource');
    /** @var \Drupal\jsonapi\ResourceType\ResourceTypeRepositoryInterface $entity_type_repository */
    $entity_type_repository = $this->container->get('jsonapi.resource_type.repository');
    $resource_type = $entity_type_repository->get('node', 'article');

    // Default using \Drupal\jsonapi\Query\OffsetPage::SIZE_MAX.
    $request = Request::create('/jsonapi/node/article');
    $request->query = new ParameterBag();
    $response = $entity_resource->getCollection($resource_type, $request);
    $data = $response->getResponseData()->getData();
    $this->assertSame(50, $data->count());

    // With page limit.
    $request = Request::create('/jsonapi/node/article');
    $request->query = new ParameterBag([
      'page' => [
        'limit' => 10,
      ],
    ]);
    $response = $entity_resource->getCollection($resource_type, $request);
    $data = $response->getResponseData()->getData();
    $this->assertSame(10, $data->count());

    // With page limit over size max.
    $request = Request::create('/jsonapi/node/article');
    $request->query = new ParameterBag([
      'page' => [
        'limit' => 100,
      ],
    ]);
    $response = $entity_resource->getCollection($resource_type, $request);
    $data = $response->getResponseData()->getData();
    $this->assertSame(50, $data->count());

    // With page limit and offset.
    $request = Request::create('/jsonapi/node/article');
    $request->query = new ParameterBag([
      'page' => [
        'offset' => 2,
        'limit' => 5,
      ],
    ]);
    $response = $entity_resource->getCollection($resource_type, $request);
    $data = $response->getResponseData()->getData();
    $this->assertSame(5, $data->count());

    // With fields as sparse fieldset.
    $request = Request::create('/jsonapi/node/article');
    $request->query = new ParameterBag([
      'fields' => [
        'node--article' => 'title',
      ],
    ]);
    $response = $entity_resource->getCollection($resource_type, $request);
    $data = $response->getResponseData()->getData();
    $this->assertSame(50, $data->count());

    // Using sparse fieldset path override.
    $request = Request::create('/jsonapi/node/article');
    $request->query = new ParameterBag([
      'fields' => [
        'node--article' => 'path,title',
      ],
    ]);
    $response = $entity_resource->getCollection($resource_type, $request);
    $data = $response->getResponseData()->getData();
    $this->assertSame(60, $data->count());

    // Using sparse fieldset path override and limit.
    $request = Request::create('/jsonapi/node/article');
    $request->query = new ParameterBag([
      'fields' => [
        'node--article' => 'path,title',
      ],
      'page' => [
        'limit' => 5,
      ],
    ]);
    $response = $entity_resource->getCollection($resource_type, $request);
    $data = $response->getResponseData()->getData();
    $this->assertSame(5, $data->count());

    // Using sparse fieldset path override and limit.
    $request = Request::create('/jsonapi/node/article');
    $request->query = new ParameterBag([
      'fields' => [
        'node--article' => 'path,title',
      ],
      'page' => [
        'limit' => 80,
      ],
    ]);
    $response = $entity_resource->getCollection($resource_type, $request);
    $data = $response->getResponseData()->getData();
    $this->assertSame(60, $data->count());
  }

}
