<?php

namespace Drupal\next\Plugin;

use Drupal\Core\Entity\EntityInterface;

/**
 * Defines an interface for the site_previewer plugin.
 */
interface SitePreviewerInterface {

  /**
   * Returns the ID of the plugin.
   *
   * @return string
   *   The plugin ID.
   */
  public function getId(): string;

  /**
   * Returns the label for the plugin.
   *
   * @return string
   *   The plugin label.
   */
  public function getLabel(): string;

  /**
   * Returns the description for the plugin.
   *
   * @return string
   *   The plugin description.
   */
  public function getDescription(): string;

  /**
   * Renders the preview.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity.
   * @param \Drupal\next\Entity\NextSiteInterface[] $sites
   *   An array of next_site entities.
   *
   * @return array
   *   The renderable output.
   */
  public function render(EntityInterface $entity, array $sites);

}
