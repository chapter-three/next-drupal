<?php

namespace Drupal\Tests\next\Kernel\Plugin;

use Drupal\Component\Serialization\Json;
use Drupal\KernelTests\KernelTestBase;
use Drupal\next\Entity\NextEntityTypeConfig;
use Drupal\next\Entity\NextSite;
use Drupal\Tests\node\Traits\NodeCreationTrait;
use Drupal\Tests\user\Traits\UserCreationTrait;
use Drupal\user\Entity\User;
use Symfony\Component\HttpFoundation\Request;

/**
 * Tests the preview_url_generator plugin.
 *
 * @coversDefaultClass \Drupal\next\Plugin\Next\PreviewUrlGenerator\SimpleOauth
 *
 * @group next
 */
class SimpleOauthPreviewUrlGeneratorTest extends KernelTestBase {

  use NodeCreationTrait, UserCreationTrait;

  /**
   * {@inheritdoc}
   */
  protected static $modules = ['filter', 'next', 'node', 'system', 'user'];

  /**
   * The next site.
   *
   * @var \Drupal\next\Entity\NextSiteInterface
   */
  protected $nextSite;

  /**
   * The next settings manager.
   *
   * @var \Drupal\next\NextSettingsManagerInterface
   */
  protected $nextSettingsManager;

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

    $this->nextSettingsManager = $this->container->get('next.settings.manager');

    // Create NextSite entities.
    $this->nextSite = NextSite::create([
      'label' => 'Blog',
      'id' => 'blog',
      'base_url' => 'https://blog.com',
      'preview_url' => 'https://blog.com/api/preview',
      'preview_secret' => 'one',
    ]);
    $this->nextSite->save();

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
   * @covers ::generate
   */
  public function testGenerate() {
    // For anonymous users, we return the live url.
    $this->setCurrentUser(User::load(0));
    $page = $this->createNode(['type' => 'page']);
    $this->assertSame($this->nextSite->getPreviewUrlForEntity($page)
      ->toUriString(), $this->nextSite->getLiveUrlForEntity($page)
      ->toUriString());

    // For logged in users, we generate a preview url.
    $user = $this->createUser(['access content']);
    $this->setCurrentUser($user);
    $preview_url = $this->nextSite->getPreviewUrlForEntity($page);
    $query = $preview_url->getOption('query');
    $this->assertNotEmpty($query['slug']);
    $this->assertNotEmpty($query['timestamp']);
    $this->assertNotEmpty($query['secret']);
    $this->assertSame($query['plugin'], 'simple_oauth');

    // Test the secret.
    /** @var \Drupal\next\PreviewSecretGeneratorInterface $secret_generator */
    $secret_generator = \Drupal::service('next.preview_secret_generator');
    $this->assertSame($query['secret'], $secret_generator->generate($query['timestamp'] . $query['slug'] . $query['resourceVersion']));
  }

  /**
   * @covers ::validate
   * @dataProvider providerValidateForInvalidBody
   */
  public function testValidateForInvalidBody($body, $message, $is_valid = FALSE) {
    $request = Request::create('/', 'POST', [], [], [], [], Json::encode($body));
    $preview_url_generator = $this->nextSettingsManager->getPreviewUrlGenerator();

    if (!$is_valid) {
      $this->expectExceptionMessage($message);
      return $preview_url_generator->validate($request);
    }
  }

  /**
   * @covers ::validate
   */
  public function testValidateSecret() {
    $user = $this->createUser(['access content']);
    $this->setCurrentUser($user);
    $page = $this->createNode(['type' => 'page']);
    $preview_url = $this->nextSite->getPreviewUrlForEntity($page);
    $query = $preview_url->getOption('query');

    $request = Request::create('/', 'POST', [], [], [], [], Json::encode($query));
    $preview_url_generator = $this->nextSettingsManager->getPreviewUrlGenerator();

    $preview_url_generator->validate($request);
    $this->expectExceptionMessage('The provided secret is invalid.');
    $query = $preview_url->getOption('query');
    $query['timestamp'] = strtotime('+60seconds');
    $request = Request::create('/', 'POST', [], [], [], [], Json::encode($query));
    $preview_url_generator->validate($request);

    $this->expectExceptionMessage('The provided secret is invalid.');
    $query = $preview_url->getOption('query');
    $query['slug'] = '/random-slug';
    $request = Request::create('/', 'POST', [], [], [], [], Json::encode($query));
    $preview_url_generator->validate($request);

    $this->expectExceptionMessage('The provided secret is invalid.');
    $query = $preview_url->getOption('query');
    $query['resourceVersion'] = 'rel:23';
    $request = Request::create('/', 'POST', [], [], [], [], Json::encode($query));
    $preview_url_generator->validate($request);
  }

  /**
   * Provides test data for testValidateForInvalidBody.
   *
   * @return array[]
   *   An array of test data.
   */
  public function providerValidateForInvalidBody() {
    return [
      [[], "Field 'slug' is missing"],
      [['slug' => '/node/1'], "Field 'timestamp' is missing"],
      [
        [
          'slug' => '/node/1',
          'timestamp' => strtotime('now'),
        ],
        "Field 'secret' is missing",
      ],
      [
        [
          'slug' => '/node/1',
          'timestamp' => strtotime('-60 seconds'),
          'secret' => 'secret',
        ],
        "The provided secret has expired.",
      ],
      [
        [
          'slug' => '/node/1',
          'timestamp' => strtotime('60 seconds'),
          'secret' => 'secret',
        ],
        "",
        TRUE,
      ],
    ];
  }

}
