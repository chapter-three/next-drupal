<?php

namespace Drupal\next;

use Drupal\Core\Config\Entity\ConfigEntityListBuilder;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Entity\EntityTypeBundleInfoInterface;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\next\Plugin\SiteResolverManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Defines a class to build a listing of next_entity_type_config entities.
 *
 * @see \Drupal\next\Entity\NextEntityTypeConfig
 */
class NextEntityTypeConfigListBuilder extends ConfigEntityListBuilder {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The entity type bundle info.
   *
   * @var \Drupal\Core\Entity\EntityTypeBundleInfoInterface
   */
  protected $entityTypeBundleInfo;

  /**
   * The site resolver plugin manager.
   *
   * @var \Drupal\next\Plugin\SiteResolverManagerInterface
   */
  protected $siteResolverManager;

  /**
   * NextEntityTypeConfigListBuilder constructor.
   *
   * @param \Drupal\Core\Entity\EntityTypeInterface $entity_type
   *   The entity type.
   * @param \Drupal\Core\Entity\EntityStorageInterface $storage
   *   The storage.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\Core\Entity\EntityTypeBundleInfoInterface $entity_type_bundle_info
   *   The entity type bundle info.
   * @param \Drupal\next\Plugin\SiteResolverManagerInterface $site_resolver_manager
   *   The site resolver plugin manager.
   */
  public function __construct(EntityTypeInterface $entity_type, EntityStorageInterface $storage, EntityTypeManagerInterface $entity_type_manager, EntityTypeBundleInfoInterface $entity_type_bundle_info, SiteResolverManagerInterface $site_resolver_manager) {
    parent::__construct($entity_type, $storage);
    $this->entityTypeManager = $entity_type_manager;
    $this->entityTypeBundleInfo = $entity_type_bundle_info;
    $this->siteResolverManager = $site_resolver_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function createInstance(ContainerInterface $container, EntityTypeInterface $entity_type) {
    return new static($entity_type, $container->get('entity_type.manager')
      ->getStorage($entity_type->id()), $container->get('entity_type.manager'), $container->get('entity_type.bundle.info'), $container->get('plugin.manager.next.site_resolver'));
  }

  /**
   * {@inheritdoc}
   */
  protected function getTitle() {
    return $this->t('Entity types');
  }

  /**
   * {@inheritdoc}
   */
  public function render() {
    $build = parent::render();
    $build['table']['#empty'] = $this->t('No entity type configured.');
    return $build;
  }

  /**
   * {@inheritdoc}
   */
  public function buildHeader() {
    $header['entity_type'] = $this->t('Entity type');
    $header['bundle'] = $this->t('Bundle');
    $header['site_resolver'] = $this->t('Site resolver');
    $header['summary'] = '';
    $header['revalidator'] = $this->t('Revalidator');
    return $header + parent::buildHeader();
  }

  /**
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity) {
    /** @var \Drupal\next\Entity\NextEntityTypeConfigInterface $entity */
    [$entity_type_id, $bundle] = explode('.', $entity->id());
    $entity_type = $this->entityTypeManager->getDefinition($entity_type_id);
    $bundle_info = $this->entityTypeBundleInfo->getBundleInfo($entity_type_id);

    $row['entity_type'] = $entity_type->getLabel();
    $row['bundle'] = $bundle_info[$bundle]['label'];
    $row['site_resolver'] = '';
    $row['summary'] = [];
    $row['revalidator'] = '';

    /** @var \Drupal\next\Plugin\SiteResolverInterface $site_resolver */
    if ($site_resolver = $entity->getSiteResolver()) {
      $row['site_resolver'] = $site_resolver->getLabel();
      $row['summary'] = [];

      if ($summary = $site_resolver->configurationSummary()) {
        $row['summary']['data'] = [
          '#type' => 'inline_template',
          '#template' => '<div class="summary">{{ summary|safe_join("<br />") }}</div>',
          '#context' => ['summary' => $summary],
        ];
      }
    }

    if ($revalidator = $entity->getRevalidator()) {
      $row['revalidator'] = $revalidator->getLabel();
    }

    return $row + parent::buildRow($entity);
  }

}
