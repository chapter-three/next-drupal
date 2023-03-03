<?php

namespace Drupal\Tests\next\Kernel\Event;

use Drupal\Core\Database\Database;
use Drupal\dblog\Controller\DbLogController;
use Drupal\KernelTests\KernelTestBase;
use Drupal\node\Entity\NodeType;
use Drupal\Tests\node\Traits\NodeCreationTrait;

/**
 * Tests the EntityActionEvent.
 *
 * @group next
 */
class EntityActionEventTest extends KernelTestBase {

  use NodeCreationTrait;

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
  }

  /**
   * Test entity action events.
   */
  public function testEntityActionEvents() {
    $page = $this->createNode(['type' => 'page', 'title' => 'A page']);

    // Insert.
    $page->save();
    _drupal_shutdown_function();
    $this->assertLogsContains("Event next.entity.action dispatched for entity A page and action insert.");

    // Update.
    $page->set('title', 'A page updated')->save();
    _drupal_shutdown_function();
    $this->assertLogsContains("Event next.entity.action dispatched for entity A page updated and action update.");

    // Delete.
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
