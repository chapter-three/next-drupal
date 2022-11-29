<?php

namespace Drupal\Tests\next\Kernel\Plugin;

use Drupal\KernelTests\KernelTestBase;
use Drupal\next\Plugin\Next\PreviewUrlGenerator\SimpleOauth;
use Drupal\next\Plugin\Next\SitePreviewer\Iframe;

/**
 * Tests the next.settings.manager service.
 *
 * @coversDefaultClass \Drupal\next\NextSettingsManager
 *
 * @group next
 */
class NextSettingsManagerTest extends KernelTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = ['filter', 'next', 'node', 'system', 'user'];

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
  }

  /**
   * @covers ::all
   * @covers ::get
   * @covers ::getSitePreviewer
   * @covers ::getPreviewUrlGenerator
   * @covers ::isDebug
   */
  public function test() {
    $settings = $this->nextSettingsManager->all();
    $this->assertSame('iframe', $settings['site_previewer']);
    $this->assertSame('simple_oauth', $settings['preview_url_generator']);
    $this->assertSame(FALSE, $settings['debug']);
    $this->assertFalse($this->nextSettingsManager->isDebug());

    $this->container->get('config.factory')
      ->getEditable('next.settings')
      ->set('debug', TRUE)
      ->save();
    $settings = $this->nextSettingsManager->all();
    $this->assertSame(TRUE, $settings['debug']);
    $this->assertTrue($this->nextSettingsManager->isDebug());

    $this->assertInstanceOf(Iframe::class, $this->nextSettingsManager->getSitePreviewer());
    $this->assertInstanceOf(SimpleOauth::class, $this->nextSettingsManager->getPreviewUrlGenerator());
  }

}
