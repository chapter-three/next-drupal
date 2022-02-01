<?php

namespace Drupal\next_extras\Plugin\Field\FieldType;

use Drupal\Core\Field\FieldItemList;
use Drupal\Core\TypedData\ComputedItemListTrait;

/**
 * Class ContentTranslationsFieldItemList.
 */
class ContentTranslationsFieldItemList extends FieldItemList {

  use ComputedItemListTrait;

  /**
   * {@inheritdoc}
   */
  protected function computeValue() {
    /** @var \Drupal\Core\Entity\ContentEntityInterface $entity */
    $entity = $this->getEntity();

    if (!$entity->isTranslatable() || !$entity->id()) {
      return NULL;
    }

    $langcodes = array_keys($entity->getTranslationLanguages());
    foreach ($langcodes as $delta => $langcode) {
      $translation = $entity->getTranslation($langcode);
      $this->list[$delta] = $this->createItem($delta, [
        'label' => $translation->label(),
        'path' => $translation->toUrl()->toString(),
        'langcode' => $langcode,
      ]);
    }
  }

}
