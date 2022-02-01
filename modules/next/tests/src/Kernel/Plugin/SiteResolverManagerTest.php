<?php

namespace Drupal\Tests\next\Kernel\Plugin;

use Drupal\KernelTests\KernelTestBase;

/**
 * Tests the site_resolver plugin manager.
 *
 * @coversDefaultClass \Drupal\next\Plugin\SiteResolverManager
 *
 * @group next
 */
class SiteResolverManagerTest extends KernelTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = ['next'];

  /**
   * The site resolver manager.
   *
   * @var \Drupal\next\Plugin\SiteResolverManagerInterface
   */
  protected $siteResolverManager;

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();
    $this->siteResolverManager = $this->container->get('plugin.manager.next.site_resolver');
  }

  /**
   * @covers ::getDefinitions
   */
  public function testDefinitions() {
    $definitions = $this->siteResolverManager->getDefinitions();
    $this->assertEqualsCanonicalizing([
      'entity_reference_field',
      'site_selector',
    ], array_keys($definitions));
  }

}
