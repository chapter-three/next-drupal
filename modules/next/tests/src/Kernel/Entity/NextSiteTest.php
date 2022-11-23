<?php

namespace Drupal\Tests\next\Kernel\Entity;

use Drupal\KernelTests\KernelTestBase;
use Drupal\next\Entity\NextSite;
use Drupal\Tests\node\Traits\NodeCreationTrait;
use Drupal\Tests\user\Traits\UserCreationTrait;
use Drupal\user\Entity\User;

/**
 * Tests the next_site entity.
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

  /**
   * @covers ::getBaseUrl
   * @covers ::getPreviewUrl
   * @covers ::getPreviewSecret
   * @covers ::getRevalidateUrl
   * @covers ::getRevalidateSecret
   */
  public function test() {
    $marketing = NextSite::create([
      'label' => 'Marketing',
      'id' => 'marketing',
      'base_url' => 'https://marketing.com',
      'preview_url' => 'https://marketing.com/api/preview',
      'preview_secret' => 'two',
      'revalidate_url' => 'https://marketing.com/api/revalidate',
      'revalidate_secret' => 'three',
    ]);
    $marketing->save();

    $this->assertSame('https://marketing.com', $marketing->getBaseUrl());
    $this->assertSame('https://marketing.com/api/preview', $marketing->getPreviewUrl());
    $this->assertSame('two', $marketing->getPreviewSecret());
    $this->assertSame('https://marketing.com/api/revalidate', $marketing->getRevalidateUrl());
    $this->assertSame('three', $marketing->getRevalidateSecret());

    $marketing->setBaseUrl('http://blog.com');
    $this->assertSame('http://blog.com', $marketing->getBaseUrl());

    $marketing->setPreviewUrl('http://blog.com/api/preview');
    $this->assertSame('http://blog.com/api/preview', $marketing->getPreviewUrl());

    $marketing->setPreviewSecret('123');
    $this->assertSame('123', $marketing->getPreviewSecret());

    $marketing->setRevalidateUrl('http://blog.com/api/revalidate');
    $this->assertSame('http://blog.com/api/revalidate', $marketing->getRevalidateUrl());

    $marketing->setRevalidateSecret('xxxxxx');
    $this->assertSame('xxxxxx', $marketing->getRevalidateSecret());
  }

  /**
   * @covers ::getRevalidateUrlForPath
   */
  public function testGetRevalidateUrlForPath() {
    $marketing = NextSite::create([
      'label' => 'Marketing',
      'id' => 'marketing',
      'base_url' => 'https://marketing.com',
      'preview_url' => 'https://marketing.com/api/preview',
      'preview_secret' => 'two',
    ]);
    $marketing->save();

    $this->assertNull($marketing->getRevalidateUrlForPath('/foo'));

    $marketing->setRevalidateUrl('http://example.com/api/revalidate');
    $this->assertSame('http://example.com/api/revalidate?slug=/foo', $marketing->getRevalidateUrlForPath('/foo')->toString());

    $marketing->setRevalidateSecret('12345');
    $this->assertSame('http://example.com/api/revalidate?slug=/foo&secret=12345', $marketing->getRevalidateUrlForPath('/foo')->toString());
  }

}
