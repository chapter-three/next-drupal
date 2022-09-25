<?php

namespace Drupal\Tests\next\Kernel\Event;

use Drupal\Core\Database\Database;
use Drupal\dblog\Controller\DbLogController;
use Drupal\KernelTests\KernelTestBase;
use Drupal\next\Entity\NextEntityTypeConfig;
use Drupal\next\Entity\NextSite;
use Drupal\node\Entity\Node;
use Drupal\node\Entity\NodeType;

/**
 * Tests the EntityActionEvent.
 */
class EntityActionEventTest extends KernelTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'filter',
    'next',
    'next_tests',
    'node',
    'system',
    'user',
    'dblog',
  ];

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    $this->installEntitySchema('node');
    $this->installEntitySchema('user');
    $this->installConfig(['filter', 'next', 'system', 'user']);
    $this->installSchema('dblog', ['watchdog']);
    $this->installSchema('system', ['sequences']);
    $this->installSchema('node', ['node_access']);
    $this->installSchema('user', ['users_data']);

    // Create page type.
    $page_type = NodeType::create([
      'type' => 'page',
      'label' => 'Page',
    ]);
    $page_type->save();

    // Create NextSite entities.
    $blog = NextSite::create([
      'label' => 'Blog',
      'id' => 'blog',
      'base_url' => 'https://blog.com',
      'preview_url' => 'https://blog.com/api/preview',
      'preview_secret' => 'one',
    ]);
    $blog->save();

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
  }

  /**
   * Test entity action events.
   */
  public function testEntityActionEvents() {
    $page = Node::create([
      'title' => 'A page',
      'type' => 'page',
    ]);

    $page->save();
    _drupal_shutdown_function();
    $this->assertLogsContains("Event next.entity.action dispatched for entity A page and action insert.");

    $page->set('title', 'A page updated')->save();
    _drupal_shutdown_function();
    $this->assertLogsContains("Event next.entity.action dispatched for entity A page updated and action update.");

    $page->delete();
    _drupal_shutdown_function();
    $this->assertLogsContains("Event next.entity.action dispatched for entity A page updated and action delete.");
  }

  /**
   * Helper to assert logs.
   *
   * @param string $message
   *   The message to assert in the logs.
   */
  protected function assertLogsContains(string $message) {
    $logs = Database::getConnection()
      ->select('watchdog', 'wd')
      ->fields('wd', ['message', 'variables'])
      ->condition('type', 'system')
      ->execute()
      ->fetchAll();

    $controller = DbLogController::create($this->container);
    $messages = array_map(function ($log) use ($controller) {
      return (string) $controller->formatMessage($log);
    }, $logs);

    $this->assertContains($message, $messages);
  }

}
