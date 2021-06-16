<?php

namespace Drupal\next_extras\Plugin\Field\FieldType;

use Drupal\Core\Field\FieldItemBase;
use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\Core\TypedData\DataDefinition;

/**
 * Defines the 'content_translations' entity field type.
 *
 * @FieldType(
 *   id = "content_translations",
 *   label = @Translation("Content translations"),
 *   description = @Translation("An entity field containing data about content translations."),
 *   no_ui = TRUE,
 *   list_class = "\Drupal\next_extras\Plugin\Field\FieldType\ContentTranslationsFieldItemList",
 *   cardinality = \Drupal\Core\Field\FieldStorageDefinitionInterface::CARDINALITY_UNLIMITED
 * )
 */
class ContentTranslationsItem extends FieldItemBase {

  /**
   * {@inheritdoc}
   */
  public static function propertyDefinitions(FieldStorageDefinitionInterface $field_definition) {
    $properties['label'] = DataDefinition::create('string')
      ->setLabel(t('Label'));

    $properties['path'] = DataDefinition::create('string')
      ->setLabel(t('Path alias'));

    $properties['langcode'] = DataDefinition::create('string')
      ->setLabel(t('Language Code'));

    return $properties;
  }

  /**
   * {@inheritdoc}
   */
  public static function schema(FieldStorageDefinitionInterface $field_definition) {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function isEmpty() {
    return $this->label === NULL && $this->path === '' && $this->langcode === NULL;
  }

}
