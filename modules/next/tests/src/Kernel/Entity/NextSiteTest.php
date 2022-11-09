<?php

namespace Drupal\Tests\next\Kernel\Entity;

use Drupal\Component\Serialization\Json;
use Drupal\KernelTests\KernelTestBase;
use Drupal\next\Controller\NextPreviewUrlController;
use Drupal\next\Entity\NextSite;
use Drupal\Tests\node\Traits\NodeCreationTrait;
use Drupal\Tests\user\Traits\UserCreationTrait;
use Drupal\user\Entity\User;
use Symfony\Component\HttpFoundation\Request;

/**
 * Tests the NextSite entity.
 *
 * @coversDefaultClass \Drupal\next\Entity\NextSite
 *
 * @group next
 */
class NextSiteTest extends KernelTestBase {

  use NodeCreationTrait, UserCreationTrait;

  /**
   * {@inheritdoc}
   */
  protected static $modules = ['filter', 'next', 'node', 'system', 'user'];

  /**
   * The next_site entity.
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

    $this->nextSite = NextSite::create([
      'label' => 'Blog',
      'id' => 'blog',
      'base_url' => 'https://blog.com',
      'preview_url' => 'https://blog.com/api/preview',
      'preview_secret' => 'one'
    ]);
    $this->nextSite->save();

    $this->setUpCurrentUser();
  }

  /**
   * @covers ::getPreviewUrlForEntity
   */
  public function testGetPreviewUrlForEntity() {
    $user = $this->createUser(['access content']);
    $this->setCurrentUser($user);

    // User entity type is not versionable.
    // No resourceVersion in the query.
    $preview_url = $this->nextSite->getPreviewUrlForEntity(User::load(1));
    $query = $preview_url->getOption('query');
    $this->assertNotContains('resourceVersion', array_keys($query));

    // Node entity type is versionable.
    // Expect a resourceVersion.
    $node = $this->createNode();
    $preview_url = $this->nextSite->getPreviewUrlForEntity($node);
    $query = $preview_url->getOption('query');
    $this->assertSame('rel:latest-version', $query['resourceVersion']);
  }

}
