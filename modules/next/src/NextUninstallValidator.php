<?php

namespace Drupal\next;

use Drupal\Core\Extension\ModuleUninstallValidatorInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\Url;
use Drupal\next\Plugin\PreviewUrlGeneratorManagerInterface;

/**
 * Prevents module with active preview url generators from being uninstalled.
 */
class NextUninstallValidator implements ModuleUninstallValidatorInterface {

  use StringTranslationTrait;

  /**
   * The plugin manager.
   *
   * @var \Drupal\next\Plugin\PreviewUrlGeneratorManagerInterface
   */
  protected PreviewUrlGeneratorManagerInterface $previewUrlGeneratorManager;

  /**
   * The next settings manager.
   *
   * @var \Drupal\next\NextSettingsManagerInterface
   */
  protected NextSettingsManagerInterface $nextSettings;

  /**
   * NextUninstallValidator constructor.
   *
   * @param \Drupal\next\Plugin\PreviewUrlGeneratorManagerInterface $preview_url_generator_manager
   *   The plugin manager.
   * @param \Drupal\next\NextSettingsManagerInterface $next_settings
   *   The next settings service.
   */
  public function __construct(PreviewUrlGeneratorManagerInterface $preview_url_generator_manager, NextSettingsManagerInterface $next_settings) {
    $this->previewUrlGeneratorManager = $preview_url_generator_manager;
    $this->nextSettings = $next_settings;
  }

  /**
   * {@inheritdoc}
   */
  public function validate($module) {
    $preview_url_generator_plugins = $this->getPreviewUrlGeneratorPluginsForModule($module);
    $active_preview_url_generator = $this->nextSettings->get('preview_url_generator');

    if (!$preview_url_generator_plugins || !in_array($active_preview_url_generator, array_keys($preview_url_generator_plugins))) {
      return [];
    }

    return [
      $this->t('Next.js is configured to use a preview url generator plugin provided by this module. <a href=":uri">Update settings</a>.', [
        ':uri' => Url::fromRoute('next.settings')->toString(),
      ]),
    ];
  }

  /**
   * Returns preview url generator plugins provided by given module.
   *
   * @param string $module
   *   The module name.
   *
   * @return array
   *   An array of preview url generator plugins.
   */
  protected function getPreviewUrlGeneratorPluginsForModule(string $module) {
    return array_filter($this->previewUrlGeneratorManager->getDefinitions(), function ($definition) use ($module) {
      return $definition['provider'] == $module;
    });
  }

}
