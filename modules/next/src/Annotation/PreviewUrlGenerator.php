<?php

namespace Drupal\next\Annotation;

use Drupal\Component\Annotation\Plugin;

/**
 * Defines a preview_url_generator annotation object.
 *
 * @Annotation
 */
class PreviewUrlGenerator extends Plugin {

  /**
   * The ID of the plugin.
   *
   * @var string
   */
  public string $id;

  /**
   * The label for the plugin.
   *
   * @var string
   */
  public string $label;

  /**
   * The description for the plugin.
   *
   * @var string
   */
  public string $description;

}
