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
    $header['id'] = $this->t('ID');
    $header['label'] = $this->t('Label');
    $header['base_url'] = $this->t('Base URL');
    $header['preview_secret'] = $this->t('Preview secret');
    return $header + parent::buildHeader();
  }

  /**
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity) {
    /** @var \Drupal\next\Entity\NextSiteInterface $entity */
    $row['id'] = $entity->uuid();
    $row['label'] = $entity->label();
    $row['base_url'] = $entity->getBaseUrl();
    $row['preview_secret'] = $entity->getPreviewSecret();

    return $row + parent::buildRow($entity);
  }

}
