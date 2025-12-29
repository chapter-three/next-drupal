<?php

namespace Drupal\Tests\next\Kernel\Event;

use Drupal\KernelTests\KernelTestBase;
use Drupal\language\Entity\ConfigurableLanguage;
use Drupal\node\Entity\NodeType;
use Drupal\Tests\node\Traits\NodeCreationTrait;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

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
    'content_translation',
    'language',
  ];

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    $this->installEntitySchema('node');
    $this->installEntitySchema('user');
    $this->installConfig(['filter', 'next', 'system', 'user', 'language']);
    $this->installSchema('dblog', ['watchdog']);
    $this->installSchema('node', ['node_access']);
    $this->installSchema('user', ['users_data']);

    // Create page type.
    $page_type = NodeType::create([
      'type' => 'page',
      'label' => 'Page',
    ]);
    $page_type->save();

    // Set up multilingual.
    ConfigurableLanguage::createFromLangcode('nl')->save();
  }

  /**
   * Test entity action events.
   */
  public function testEntityActionEvents(): void {
    $page = $this->createNode(['type' => 'page', 'title' => 'A page']);
    $page->addTranslation('nl', ['title' => 'Translation']);

    // Insert.
    $page->save();
    $this->container->get('kernel')->terminate(Request::create('/'), new Response());
    $this->assertLogMessage('insert');

    // Update.
    $page->set('title', 'A page updated')->save();
    $this->container->get('kernel')->terminate(Request::create('/'), new Response());
    $this->assertLogMessage('update');

    // Delete translation.
    $page->removeTranslation('nl');
    $page->save();
    $this->container->get('kernel')->terminate(Request::create('/'), new Response());
    $this->assertLogMessage('update');

    // Delete.
    $page->delete();
    $this->container->get('kernel')->terminate(Request::create('/'), new Response());
    $this->assertLogMessage('update');
  }

  /**
   * Helper to assert log.
   *
   * @param string $action
   *   The action to perform.
   */
  protected function assertLogMessage(string $action): void {
    $message = 'Event @event dispatched for entity @label and action @action.';
    $variables = [
      '@event' => 'next.entity.action',
      '@label' => 'A page',
      '@action' => $action,
    ];

    $this->assertNotEmpty($this->container->get('database')->select('watchdog', 'w')
      ->condition('type', 'system')
      ->condition('message', $message)
      ->condition('variables', serialize($variables))
      ->countQuery()
      ->execute()
      ->fetchField()
    );
  }

}
