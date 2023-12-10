<?php

namespace Drupal\next\Form;

use Drupal\Core\Entity\EntityDeleteForm;
use Drupal\Core\Url;

/**
 * Provides a deletion confirmation form for next_entity_type_config.
 */
class NextEntityTypeConfigDeleteForm extends EntityDeleteForm {

  /**
   * {@inheritdoc}
   */
  public function getCancelUrl() {
    return new Url('entity.next_entity_type_config.collection');
  }

}
