<?php

namespace Drupal\Tests\next\Kernel\Renderer\MainContent;

use Drupal\Component\Serialization\Json;
use Drupal\KernelTests\KernelTestBase;
use Drupal\next\Controller\NextPreviewUrlController;
use Drupal\next\Entity\NextSite;
use Drupal\Tests\node\Traits\NodeCreationTrait;
use Drupal\Tests\user\Traits\UserCreationTrait;
use Symfony\Component\HttpFoundation\Request;

/**
 * Tests the NextPreviewUrlController.
 *
 * @coversDefaultClass \Drupal\next\Controller\NextPreviewUrlController
 *
 * @group next
 */
class NextPreviewUrlControllerTest extends KernelTestBase {

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
   * @covers ::validate
   */
  public function testValidate() {
    $user = $this->createUser(['access content']);
    $this->setCurrentUser($user);
    $page = $this->createNode(['type' => 'page']);
    $preview_url = $this->nextSite->getPreviewUrlForEntity($page);
    $query = $preview_url->getOption('query');

    $request = Request::create('/next/preview-url', 'POST', [], [], [], [], Json::encode($query));

    $controller = NextPreviewUrlController::create($this->container);
    $response = $controller->validate($request);
    $this->assertSame(['scope' => $user->getRoles(TRUE)[0]], Json::decode($response->getContent()));
  }

}
