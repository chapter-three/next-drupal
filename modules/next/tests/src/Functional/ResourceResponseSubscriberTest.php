<?php

namespace Drupal\Tests\next\Functional;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\language\Entity\ConfigurableLanguage;
use Drupal\language\Entity\ContentLanguageSettings;
use Drupal\next\Entity\NextEntityTypeConfig;
use Drupal\next\Entity\NextSite;
use Drupal\node\Entity\Node;
use Drupal\node\Entity\NodeType;
use Drupal\taxonomy\Entity\Term;
use Drupal\taxonomy\Entity\Vocabulary;
use Drupal\Tests\BrowserTestBase;
use Drupal\Tests\field\Traits\EntityReferenceFieldCreationTrait;
use Drupal\Tests\field\Traits\EntityReferenceTestTrait;

/**
 * Tests the cache tag resource response subscriber.
 *
 * @coversDefaultClass \Drupal\next\EventSubscriber\ResourceResponseSubscriber
 *
 * @group next
 */
class ResourceResponseSubscriberTest extends BrowserTestBase {

  use EntityReferenceFieldCreationTrait;

  /**
   * Test node with translation.
   *
   * @var \Drupal\node\Entity\Node
   */
  protected $nodeWithTranslation;

  /**
   * The cache tag node mapper service.
   *
   * @var \Drupal\next\CacheTagNodeMapperInterface
   */
  protected $cacheTagNodeMapper;

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'content_translation',
    'jsonapi',
    'language',
    'next',
    'node',
    'path',
    'next',
    'serialization',
    'taxonomy',
  ];

  /**
   * {@inheritdoc}
   */
  protected $defaultTheme = 'stark';

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    $this->cacheTagNodeMapper = $this->container->get('next.cache_tag_node_mapper');

    ConfigurableLanguage::createFromLangcode('nl')->save();
    \Drupal::configFactory()->getEditable('language.negotiation')
      ->set('url.prefixes.en', 'en')
      ->set('url.prefixes.nl', 'nl')
      ->save();

    NodeType::create([
      'type' => 'article',
    ])->save();

    ContentLanguageSettings::create([
      'target_entity_type_id' => 'node',
      'target_bundle' => 'article',
    ])
      ->setThirdPartySetting('content_translation', 'enabled', TRUE)
      ->save();

    Vocabulary::create([
      'vid' => 'tags',
      'name' => 'Tags',
    ])->save();
    $this->createEntityReferenceField(
      'node',
      'article',
      'field_tags',
      'Tags',
      'taxonomy_term',
      'default',
      [
        'target_bundles' => [
          'tags' => 'tags',
        ],
        'auto_create' => TRUE,
      ],
      FieldStorageDefinitionInterface::CARDINALITY_UNLIMITED
    );

    NextSite::create([
      'id' => 'test',
      'revalidate_url' => 'http://test.com/api/revalidate',
      'revalidate_secret' => '12345',
    ])->save();

    foreach (['node' => 'article', 'taxonomy_term' => 'tags'] as $entity_type => $bundle) {
      NextEntityTypeConfig::create([
        'id' => "{$entity_type}.{$bundle}",
        'preview_enabled' => FALSE,
        'site_resolver' => 'site_selector',
        'configuration' => [
          'sites' => [
            'test' => 'test',
          ],
        ],
        'revalidator' => 'cache_tag',
      ])->save();
    }

    $this->drupalLogin($this->drupalCreateUser(['access content']));
    \Drupal::service('router.builder')->rebuild();
  }

  /**
   * Test jsonapi requests.
   */
  public function testJsonApiRequest() {
    $node = Node::create([
      'type' => 'article',
      'title' => $this->randomString(),
    ]);
    $node->save();

    // Not a jsonapi individual request.
    $this->drupalGet($node->toUrl()->toString());
    $this->assertEmpty($this->cacheTagNodeMapper->getCacheTagsByNid($node->id(), 'en', 'test'));

    // A jsonapi individual request with missing X-NextJS-Site header.
    $this->getIndividual($node);
    $this->assertEmpty($this->cacheTagNodeMapper->getCacheTagsByNid($node->id(), 'en', 'test'));

    // A jsonapi individual request with incorrect X-NextJS-Site header value.
    $this->getIndividual($node, [], ['X-NextJS-Site' => 'undefined']);
    $this->assertEmpty($this->cacheTagNodeMapper->getCacheTagsByNid($node->id(), 'en', 'test'));

    $this->getIndividual($node, [], ['X-NextJS-Site' => 'test']);
    $this->assertEquals(
      $node->getCacheTags(),
      $this->cacheTagNodeMapper->getCacheTagsByNid($node->id(), 'en', 'test')
    );
  }

  /**
   * Test multilingual jsonapi requests.
   */
  public function testMultilingualJsonApiRequest() {
    $node = Node::create([
      'type' => 'article',
      'title' => $this->randomString(),
    ]);
    $node->addTranslation('nl', ['title' => $this->randomString()]);
    $node->save();

    $this->jsonapiGet("/nl/jsonapi/node/article/{$node->uuid()}", [], ['X-NextJS-Site' => 'test']);
    $this->assertEquals(
      $node->getCacheTags(),
      $this->cacheTagNodeMapper->getCacheTagsByNid($node->id(), 'nl', 'test')
    );
  }

  /**
   * Test jsonapi requests with include.
   */
  public function testJsonApiRequestWithInclude() {
    $term = Term::create([
      'vid' => 'tags',
      'name' => $this->randomString(),
    ]);
    $term->save();
    $node = Node::create([
      'type' => 'article',
      'title' => $this->randomString(),
      'field_tags' => $term->id(),
    ]);
    $node->save();

    $this->getIndividual(
      $node,
      ['query' => ['include' => 'field_tags']],
      ['X-NextJS-Site' => 'test']
    );
    $this->assertEquals(
      array_merge($node->getCacheTags(), $term->getCacheTags()),
      $this->cacheTagNodeMapper->getCacheTagsByNid($node->id(), 'en', 'test')
    );
  }

  /**
   * Performs JSON:API request for the given entity.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity to request.
   * @param array $options
   *   URL options.
   * @param array $headers
   *   Request headers.
   */
  protected function getIndividual(EntityInterface $entity, array $options = [], array $headers = []): void {
    $entity_type_id = $entity->getEntityTypeId();
    $bundle = $entity->bundle();
    $path = "/jsonapi/{$entity_type_id}/{$bundle}/{$entity->uuid()}";
    $this->jsonapiGet($path, $options, $headers);
  }

  /**
   * Performs JSON:API request.
   *
   * @param string $path
   *   The request path.
   * @param array $options
   *   URL options.
   * @param array $headers
   *   Request headers.
   */
  protected function jsonapiGet(string $path, array $options = [], array $headers = []): void {
    $this->drupalGet($path, $options, [
      'Accept' => 'application/vnd.api+json',
    ] + $headers);
  }

}
