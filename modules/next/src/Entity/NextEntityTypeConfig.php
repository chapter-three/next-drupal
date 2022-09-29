<?php

namespace Drupal\next\Entity;

use Drupal\Core\Config\Entity\ConfigEntityBase;
use Drupal\Core\Entity\EntityInterface;
use Drupal\next\Plugin\RevalidatorInterface;
use Drupal\next\Plugin\SiteResolverInterface;
use Drupal\next\RevalidatorPluginCollection;
use Drupal\next\SiteResolverPluginCollection;

/**
 * Defines the next_entity_type config entity.
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
 *     "revalidator",
 *     "revalidator_configuration"
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
   * The configuration of the site_resolver plugin.
   *
   * @var array
   */
  protected $configuration = [];

  /**
   * The revalidator.
   *
   * @var string
   */
  protected $revalidator;

  /**
   * The configuration of the revalidator plugin.
   *
   * @var array
   */
  protected $revalidator_configuration = [];

  /**
   * The plugin collection that stores site_resolver plugins.
   *
   * @var \Drupal\next\SiteResolverPluginCollection
   */
  protected $pluginCollection;

  /**
   * The plugin collection that stores revalidator plugins.
   *
   * @var \Drupal\next\SiteResolverPluginCollection
   */
  protected $revalidatorPluginCollection;

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
  public function getRevalidator(): ?RevalidatorInterface {
    return $this->revalidator ? $this->getRevalidatorPluginCollection()->get($this->revalidator) : NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function setRevalidator(string $plugin_id): NextEntityTypeConfigInterface {
    $this->revalidator = $plugin_id;
    $this->getRevalidatorPluginCollection()->addInstanceID($plugin_id);
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
  public function getSiteResolverConfiguration() {
    return $this->getPluginCollection()->getConfiguration();
  }

  /**
   * {@inheritdoc}
   */
  public function setSiteResolverConfiguration(string $id, array $configuration): NextEntityTypeConfigInterface {
    $collection = $this->getPluginCollection();
    if (!$collection->has($id)) {
      $configuration['id'] = $id;
      $collection->addInstanceId($id, $configuration);
    }
    else {
      $collection->setConfiguration($configuration);
    }
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getRevalidatorConfiguration() {
    return $this->getRevalidatorPluginCollection()->getConfiguration();
  }

  /**
   * {@inheritdoc}
   */
  public function setRevalidatorConfiguration(string $id, array $configuration): NextEntityTypeConfigInterface {
    $collection = $this->getRevalidatorPluginCollection();
    if (!$collection->has($id)) {
      $configuration['id'] = $id;
      $collection->addInstanceId($id, $configuration);
    }
    else {
      $collection->setConfiguration($configuration);
    }
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getPluginCollection() {
    if (!$this->pluginCollection) {
      $this->pluginCollection = new SiteResolverPluginCollection($this->siteResolverPluginManager(), $this->site_resolver, $this->configuration, $this->id());
    }
    return $this->pluginCollection;
  }

  /**
   * {@inheritdoc}
   */
  public function getRevalidatorPluginCollection() {
    if (!$this->revalidatorPluginCollection) {
      $this->revalidatorPluginCollection = new RevalidatorPluginCollection($this->revalidatorPluginManager(), $this->revalidator, $this->revalidator_configuration, $this->id());
    }
    return $this->revalidatorPluginCollection;
  }

  /**
   * {@inheritdoc}
   */
  public function getPluginCollections() {
    $collections = [];
    if ($this->pluginCollection) {
      $collections['configuration'] = $this->getPluginCollection();
    }

    if ($this->revalidatorPluginCollection) {
      $collections['revalidator_configuration'] = $this->getRevalidatorPluginCollection();
    }

    return $collections;
  }

  /**
   * Wraps the site_resolver plugin manager.
   *
   * @return \Drupal\next\Plugin\SiteResolverManagerInterface
   *   A site_resolver plugin manager object.
   */
  protected function siteResolverPluginManager() {
    return \Drupal::service('plugin.manager.next.site_resolver');
  }

  /**
   * Wraps the revalidator plugin manager.
   *
   * @return \Drupal\next\Plugin\RevalidatorManagerInterface
   *   A revalidator plugin manager object.
   */
  protected function revalidatorPluginManager() {
    return \Drupal::service('plugin.manager.next.revalidator');
  }

}
