<?php

namespace Drupal\next\Form;

use Drupal\Core\Entity\EntityDeleteForm;
use Drupal\Core\Url;

/**
 * Provides a deletion confirmation form for the next_entity_type_config deletion form.
 */
class NextEntityTypeConfigDeleteForm extends EntityDeleteForm {

  /**
   * {@inheritdoc}
   */
  public function getCancelUrl() {
    return new Url('entity.next_entity_type_config.collection');
  }

}
