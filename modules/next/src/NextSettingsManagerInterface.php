<?php

namespace Drupal\next;

use Drupal\Core\Config\ImmutableConfig;
use Drupal\next\Plugin\PreviewUrlGeneratorInterface;
use Drupal\next\Plugin\SitePreviewerInterface;

/**
 * Defines the interface for a next settings service.
 */
interface NextSettingsManagerInterface {

  /**
   * Returns the config object.
   *
   * @return \Drupal\Core\Config\ImmutableConfig
   *   The config object.
   */
  public function getConfig(): ImmutableConfig;

  /**
   * Returns an array of settings.
   *
   * @return array
   *   Returns all settings.
   */
  public function all(): array;

  /**
   * Returns the setting for the given key.
   *
   * @param string $key
   *   The setting key.
   *
   * @return mixed
   *   The setting value.
   */
  public function get(string $key);

  /**
   * Returns the selected site previewer plugin.
   *
   * @return \Drupal\next\Plugin\SitePreviewerInterface|null
   *   The selected site previewer plugin.
   */
  public function getSitePreviewer(): ?SitePreviewerInterface;

  /**
   * Returns the selected preview url generator plugin.
   *
   * @return \Drupal\next\Plugin\PreviewUrlGeneratorInterface|null
   *   The selected preview url generator plugin.
   */
  public function getPreviewUrlGenerator(): ?PreviewUrlGeneratorInterface;

}
