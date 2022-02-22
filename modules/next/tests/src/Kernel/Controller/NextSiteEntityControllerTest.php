<?php

namespace Drupal\Tests\next\Kernel\Renderer\MainContent;

use Drupal\KernelTests\KernelTestBase;
use Drupal\next\Controller\NextSiteEntityController;
use Drupal\next\Entity\NextSite;

/**
 * Tests the NextSiteEntityController.
 *
 * @coversDefaultClass \Drupal\next\Controller\NextSiteEntityController
 *
 * @group next
 */
class NextSiteEntityControllerTest extends KernelTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = ['next'];

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

    $this->nextSite = NextSite::create([
      'label' => 'Blog',
      'id' => 'blog',
      'base_url' => 'https://blog.com',
      'preview_url' => 'https://blog.com/api/preview',
      'preview_secret' => 'one'
    ]);
    $this->nextSite->save();
  }

  /**
   * @covers ::environmentVariables
   */
  public function testEnvironmentVariables() {
    $controller = NextSiteEntityController::create($this->container);
    $build = $controller->environmentVariables($this->nextSite);

    $this->assertEquals(\Drupal::requestStack()->getCurrentRequest()->getSchemeAndHttpHost(), $build['container']['NEXT_PUBLIC_DRUPAL_BASE_URL']['#context']['value']);
    $this->assertEquals(\Drupal::requestStack()->getCurrentRequest()->getHost(), $build['container']['NEXT_IMAGE_DOMAIN']['#context']['value']);
    $this->assertEquals($this->nextSite->id(), $build['container']['DRUPAL_SITE_ID']['#context']['value']);
    $this->assertEquals($this->nextSite->getPreviewSecret(), $build['container']['DRUPAL_PREVIEW_SECRET']['#context']['value']);
    $this->assertEquals(\Drupal::configFactory()->get('system.site')->get('page.front'), $build['container']['DRUPAL_FRONT_PAGE']['#context']['value']);
  }

  /**
   * @covers ::environmentVariables
   */
  public function testOverriddenEnvironmentVariables() {
    $GLOBALS['config']['next.next_site.' . $this->nextSite->id()] = [
      'preview_secret' => 'overridden'
    ];
    $overridden_entity = NextSite::load($this->nextSite->id());
    $controller = NextSiteEntityController::create($this->container);
    $build = $controller->environmentVariables($overridden_entity);
    $this->assertEquals('overridden', $build['container']['DRUPAL_PREVIEW_SECRET']['#context']['value']);
  }

}
