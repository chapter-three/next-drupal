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
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    $this->installEntitySchema('node');
    $this->installEntitySchema('user');
    $this->installConfig(['filter', 'next']);
    $this->installSchema('system', ['sequences']);
    $this->installSchema('node', ['node_access']);

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
    $this->assertContains($query['scope'], $user->getRoles());

    // Test the secret.
    /** @var \Drupal\next\PreviewSecretGeneratorInterface $secret_generator */
    $secret_generator = \Drupal::service('next.preview_secret_generator');
    $this->assertSame($query['secret'], $secret_generator->generate($query['timestamp'] . $query['slug'] . $query['scope'] . $query['resourceVersion']));
  }

  /**
   * @covers ::getScopesForCurrentUser
   * @covers ::getAdminRole
   */
  public function testCurrentUserScopes() {
    /** @var \Drupal\next\NextSettingsManagerInterface $next_settings_manager */
    $next_settings_manager = $this->container->get('next.settings.manager');
    /** @var \Drupal\next\Plugin\Next\PreviewUrlGenerator\SimpleOauth $preview_url_generator */
    $preview_url_generator = $next_settings_manager->getPreviewUrlGenerator();

    $page = $this->createNode(['type' => 'page']);

    // Log in as anonymous user.
    $this->setCurrentUser(User::load(0));
    $url = $preview_url_generator->generate($this->nextSite, $page);
    $this->assertNull($url);

    // Log in as user 1.
    $admin_role = $this->createAdminRole();
    $this->setCurrentUser(User::load(1));
    $url = $preview_url_generator->generate($this->nextSite, $page);
    $query = $url->getOption('query');
    $this->assertSame($query['scope'], $admin_role);

    // Log in as admin user.
    $admin_user = $this->createUser([], NULL, TRUE);
    $this->setCurrentUser($admin_user);
    $url = $preview_url_generator->generate($this->nextSite, $page);
    $query = $url->getOption('query');
    $this->assertSame($query['scope'], $admin_user->getRoles(TRUE)[0]);
  }

  /**
   * @covers ::validate
   * @dataProvider providerValidateForInvalidBody
   */
  public function testValidateForInvalidBody($body, $message, $is_valid = FALSE) {
    $request = Request::create('/', 'POST', [], [], [], [], Json::encode($body));

    /** @var \Drupal\next\NextSettingsManagerInterface $next_settings_manager */
    $next_settings_manager = $this->container->get('next.settings.manager');
    $preview_url_generator = $next_settings_manager->getPreviewUrlGenerator();

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

    /** @var \Drupal\next\NextSettingsManagerInterface $next_settings_manager */
    $next_settings_manager = $this->container->get('next.settings.manager');
    $preview_url_generator = $next_settings_manager->getPreviewUrlGenerator();

    $response = $preview_url_generator->validate($request);
    $role = $user->getRoles(TRUE)[0];
    $this->assertSame(['scope' => $role], $response);

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

    $this->expectExceptionMessage('The provided secret is invalid.');
    $query = $preview_url->getOption('query');
    $query['scope'] = 'editor';
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
        ['slug' => '/node/1', 'timestamp' => strtotime('now')],
        "Field 'scope' is missing",
      ],
      [
        [
          'slug' => '/node/1',
          'timestamp' => strtotime('now'),
          'scope' => 'llama',
        ],
        "Field 'secret' is missing",
      ],
      [
        [
          'slug' => '/node/1',
          'timestamp' => strtotime('-60 seconds'),
          'scope' => 'llama',
          'secret' => 'secret',
        ],
        "The provided secret has expired.",
      ],
      [
        $query,
        "",
        TRUE,
      ]
    ];
  }

}
