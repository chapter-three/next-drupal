<?php

namespace Drupal\next;

use Drupal\Core\Config\Entity\ConfigEntityListBuilder;
use Drupal\Core\Entity\EntityInterface;

/**
 * Defines a class to build a listing of next_site entities.
 *
 * @see \Drupal\next\Entity\NextSite
 */
class NextSiteListBuilder extends ConfigEntityListBuilder {

  /**
   * {@inheritdoc}
   */
  public function buildHeader() {
    $header['uuid'] = $this->t('UUID');
    $header['id'] = $this->t('ID');
    $header['label'] = $this->t('Label');
    $header['base_url'] = $this->t('Base URL');
    return $header + parent::buildHeader();
  }

  /**
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity) {
    /** @var \Drupal\next\Entity\NextSiteInterface $entity */
    $row['uuid'] = $entity->uuid();
    $row['id'] = $entity->id();
    $row['label'] = $entity->label();
    $row['base_url'] = $entity->getBaseUrl();

    return $row + parent::buildRow($entity);
  }

  /**
   * {@inheritdoc}
   */
  public function getDefaultOperations(EntityInterface $entity) {
    $operations = parent::getDefaultOperations($entity);

    $operations['environment_variables'] = [
      'title' => $this->t('Environment variables'),
      'url' => $entity->toUrl('environment-variables'),
    ];

    return $operations;
  }

}
