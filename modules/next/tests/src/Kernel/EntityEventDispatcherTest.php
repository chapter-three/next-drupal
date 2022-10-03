<?php

namespace Drupal\Tests\next\Kernel\Plugin;

use Drupal\Core\Entity\EntityInterface;
use Drupal\KernelTests\KernelTestBase;
use Drupal\next\EntityEventDispatcher;
use Drupal\Tests\node\Traits\NodeCreationTrait;
use Prophecy\Argument;

/**
 * Tests the next.entity_event_dispatcher service.
 *
 * @coversDefaultClass \Drupal\next\EntityEventDispatcher
 *
 * @group next
 */
class EntityEventDispatcherTest extends KernelTestBase {

  use NodeCreationTrait;

  /**
   * {@inheritdoc}
   */
  protected static $modules = ['filter', 'next', 'node', 'system', 'user'];

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
  }

  /**
   * @covers ::dispatch
   */
  public function testDispatch() {
    /** @var \Drupal\next\EntityEventDispatcherInterface $entity_event_dispatcher */
    $entity_event_dispatcher = $this->prophesize(EntityEventDispatcher::class);
    $this->container->set('next.entity_event_dispatcher', $entity_event_dispatcher->reveal());

    $entity = Argument::type(EntityInterface::class);
    $entity_event_dispatcher->dispatch($entity, 'insert', [])->shouldBeCalled();

    // Insert.
    $page = $this->createNode(['type' => 'page']);
    _drupal_shutdown_function();

    // Update.
    $entity_event_dispatcher->dispatch($entity, 'update', [])->shouldBeCalled();
    $page->save();
    _drupal_shutdown_function();

    // Delete.
    $entity_event_dispatcher->dispatch($entity, 'delete', ['original_path' => '/node/1'])->shouldBeCalled();
    $page->delete();
    _drupal_shutdown_function();
  }

}
