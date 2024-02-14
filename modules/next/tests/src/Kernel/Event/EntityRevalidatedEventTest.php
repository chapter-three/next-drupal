<?php

namespace Drupal\Tests\next\Kernel\Event;

use Drupal\Core\Database\Database;
use Drupal\dblog\Controller\DbLogController;
use Drupal\KernelTests\KernelTestBase;
use Drupal\next\Entity\NextEntityTypeConfig;
use Drupal\Tests\node\Traits\NodeCreationTrait;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Tests the EntityRevalidatedEvent.
 *
 * @group next
 */
class EntityRevalidatedEventTest extends KernelTestBase {

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
    $this->installEntitySchema('next_entity_type_config');
    $this->installConfig(['filter', 'next', 'system', 'user']);
    $this->installSchema('dblog', ['watchdog']);
    $this->installSchema('system', ['sequences']);
    $this->installSchema('node', ['node_access']);
    $this->installSchema('user', ['users_data']);

    // Create entity type config.
    $entity_type_config = NextEntityTypeConfig::create([
      'id' => 'node.page',
      'site_resolver' => 'site_selector',
      'configuration' => [
        'sites' => [
          'blog' => 'blog',
        ],
      ],
      'revalidator' => 'path',
      'revalidator_configuration' => [
        'revalidate_page' => TRUE,
      ],
    ]);
    $entity_type_config->save();
  }

  /**
   * Test entity revalidated events.
   */
  public function testEntityRevalidatedEvents() {
    $page = $this->createNode(['type' => 'page', 'title' => 'A page']);

    // Insert.
    $page->save();
    $this->container->get('kernel')->terminate(Request::create('/'), new Response());
    $this->assertLogsContains("Entity A page, action insert, revalidated 0.");

    // Update.
    $page->set('title', 'A page updated')->save();
    $this->container->get('kernel')->terminate(Request::create('/'), new Response());
    $this->assertLogsContains("Entity A page updated, action update, revalidated 0.");

    // Delete.
    $page->delete();
    $this->container->get('kernel')->terminate(Request::create('/'), new Response());
    $this->assertLogsContains("Entity A page updated, action delete, revalidated 0.");
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
