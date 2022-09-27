<?php

namespace Drupal\next\Entity;

use Drupal\Core\Config\Entity\ConfigEntityBase;
use Drupal\Core\Entity\EntityInterface;
use Drupal\next\Plugin\SiteResolverInterface;
use Drupal\next\SiteResolverPluginCollection;

/**
 * Defines the next_entity_type config entity.
 *
 * TODO: Use EntityWithPluginCollectionInterface?
 *
 * @ConfigEntityType(
 *   id = "next_entity_type_config",
 *   label = @Translation("Next.js entity type"),
 *   label_collection = @Translation("Next.js entity types"),
 *   label_singular = @Translation("Next.js entity type"),
 *   label_plural = @Translation("Next.js entity types"),
 *   label_count = @PluralTranslation(
 *     singular = "@count Next.js entity type",
 *     plural = "@count Next.js entity types",
 *   ),
 *   handlers = {
 *     "list_builder" = "Drupal\next\NextEntityTypeConfigListBuilder",
 *     "form" = {
 *       "add" = "Drupal\next\Form\NextEntityTypeConfigForm",
 *       "edit" = "Drupal\next\Form\NextEntityTypeConfigForm",
 *       "delete" = "Drupal\next\Form\NextEntityTypeConfigDeleteForm"
 *     },
 *     "route_provider" = {
 *       "html" = "Drupal\Core\Entity\Routing\AdminHtmlRouteProvider"
 *     },
 *   },
 *   config_prefix = "next_entity_type_config",
 *   admin_permission = "administer site configuration",
 *   static_cache = TRUE,
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "label",
 *     "uuid" = "uuid"
 *   },
 *   config_export = {
 *     "id",
 *     "site_resolver",
 *     "configuration",
 *     "revalidate",
 *     "revalidate_page",
 *     "revalidate_paths",
 *   },
 *   links = {
 *     "add-form" = "/admin/config/services/next/entity-types/add",
 *     "edit-form" = "/admin/config/services/next/entity-types/{next_entity_type_config}/edit",
 *     "delete-form" = "/admin/config/services/next/entity-types/{next_entity_type_config}/delete",
 *     "collection" = "/admin/config/services/next/entity-types"
 *   }
 * )
 */
class NextEntityTypeConfig extends ConfigEntityBase implements NextEntityTypeConfigInterface {

  /**
   * The ID of the next_entity_type_config.
   *
   * @var string
   */
  protected $id;

  /**
   * The site resolver.
   *
   * @var string
   */
  protected $site_resolver;

  /**
   * The configuration of the action.
   *
   * @var array
   */
  protected $configuration = [];

  /**
   * The revalidate value.
   *
   * @var bool
   */
  protected $revalidate;

  /**
   * The revalidate_page value.
   *
   * @var bool
   */
  protected $revalidate_page;

  /**
   * The paths to revalidate.
   *
   * @var string
   */
  protected $revalidate_paths;

  /**
   * The plugin collection that stores site_resolver plugins.
   *
   * @var \Drupal\next\SiteResolverPluginCollection
   */
  protected $pluginCollection;

  /**
   * {@inheritdoc}
   */
  public function label() {
    return $this->id;
  }

  /**
   * {@inheritdoc}
   */
  public function getSiteResolver(): ?SiteResolverInterface {
    return $this->site_resolver ? $this->getPluginCollection()->get($this->site_resolver) : NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function setSiteResolver(string $plugin_id): NextEntityTypeConfigInterface {
    $this->site_resolver = $plugin_id;
    $this->getPluginCollection()->addInstanceID($plugin_id);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getConfiguration() {
    return $this->configuration;
  }

  /**
   * {@inheritdoc}
   */
  public function setConfiguration(array $configuration): NextEntityTypeConfigInterface {
    $this->configuration = $configuration;
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getRevalidate(): bool {
    return $this->revalidate === TRUE;
  }

  /**
   * {@inheritdoc}
   */
  public function setRevalidate(bool $revalidate): NextEntityTypeConfigInterface {
    $this->revalidate = $revalidate;
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getRevalidatePage(): bool {
    return $this->revalidate_page === TRUE;
  }

  /**
   * {@inheritdoc}
   */
  public function setRevalidatePage(bool $revalidate_page): NextEntityTypeConfigInterface {
    $this->revalidate_page = $revalidate_page;
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getRevalidatePaths(): ?string {
    return $this->revalidate_paths;
  }

  /**
   * {@inheritdoc}
   */
  public function setRevalidatePaths(string $revalidate_paths): NextEntityTypeConfigInterface {
    $this->revalidate_paths = $revalidate_paths;
    return $this;
  }

  /**
   * Encapsulates the creation of the LazyPluginCollection.
   *
   * @return \Drupal\Component\Plugin\LazyPluginCollection
   *   The plugin collection.
   */
  protected function getPluginCollection() {
    if (!$this->pluginCollection && $this->site_resolver) {
      $this->pluginCollection = new SiteResolverPluginCollection($this->siteResolverPluginManager(), $this->site_resolver, $this->configuration, $this->id());
    }
    return $this->pluginCollection;
  }

  /**
   * {@inheritdoc}
   */
  public function getPluginCollections() {
    return $this->pluginCollection ? ['configuration' => $this->getPluginCollection()] : [];
  }

  /**
   * Wraps the site_resolver plugin manager.
   *
   * @return \Drupal\Component\Plugin\PluginManagerInterface
   *   A site_resolver plugin manager object.
   */
  protected function siteResolverPluginManager() {
    return \Drupal::service('plugin.manager.next.site_resolver');
  }

  /**
   * {@inheritdoc}
   */
  public function getRevalidatePathsForEntity(EntityInterface $entity): array {
    $paths = [];

    if ($this->revalidate_page) {
      $paths[] = $entity->toUrl()->toString();
    }

    if ($this->revalidate_paths) {
      $paths = array_merge($paths, array_map('trim', explode("\n", $this->revalidate_paths)));
    }

    return $paths;
  }

}
