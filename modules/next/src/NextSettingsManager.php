<?php

namespace Drupal\next;

use Drupal\Component\Plugin\Exception\PluginException;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Config\ImmutableConfig;
use Drupal\next\Plugin\PreviewUrlGeneratorInterface;
use Drupal\next\Plugin\PreviewUrlGeneratorManagerInterface;
use Drupal\next\Plugin\SitePreviewerInterface;
use Drupal\next\Plugin\SitePreviewerManagerInterface;

/**
 * Provides a service for next settings.
 */
class NextSettingsManager implements NextSettingsManagerInterface {

  /**
   * The config service.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected ConfigFactoryInterface $config;

  /**
   * The site previewer plugin manager.
   *
   * @var \Drupal\next\Plugin\SitePreviewerManagerInterface
   */
  protected SitePreviewerManagerInterface $sitePreviewerManager;

  /**
   * The preview url generator plugin manager.
   *
   * @var \Drupal\next\Plugin\PreviewUrlGeneratorManagerInterface
   */
  protected PreviewUrlGeneratorManagerInterface $previewUrlGeneratorManager;

  /**
   * NextSettingsManager constructor.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config
   *   The config service.
   * @param \Drupal\next\Plugin\SitePreviewerManagerInterface $site_previewer_manager
   *   The site previewer plugin manager.
   * @param \Drupal\next\Plugin\PreviewUrlGeneratorManagerInterface $preview_url_generator_manager
   *   The preview url generator plugin manager.
   */
  public function __construct(ConfigFactoryInterface $config, SitePreviewerManagerInterface $site_previewer_manager, PreviewUrlGeneratorManagerInterface $preview_url_generator_manager) {
    $this->config = $config;
    $this->sitePreviewerManager = $site_previewer_manager;
    $this->previewUrlGeneratorManager = $preview_url_generator_manager;
  }

  /**
   * {@inheritdoc}
   */
  public function getConfig(): ImmutableConfig {
    return $this->config->get('next.settings');
  }

  /**
   * {@inheritdoc}
   */
  public function all(): array {
    return $this->getConfig()->get();
  }

  /**
   * {@inheritdoc}
   */
  public function get(string $key) {
    return $this->getConfig()->get($key);
  }

  /**
   * {@inheritdoc}
   */
  public function getSitePreviewer(): ?SitePreviewerInterface {
    $site_previewer_id = $this->get('site_previewer');

    try {
      /** @var \Drupal\next\Plugin\SitePreviewerInterface $site_previewer */
      $this->sitePreviewerManager->createInstance($site_previewer_id, $this->get('site_previewer_configuration') ?? []);

      return $site_previewer;
    }
    catch (PluginException $exception) {
      watchdog_exception('next_drupal', $exception);

      return NULL;
    }
  }

  /**
   * {@inheritdoc}
   */
  public function getPreviewUrlGenerator(): ?PreviewUrlGeneratorInterface {
    $preview_url_generator_id = $this->get('preview_url_generator');

    try {
      /** @var \Drupal\next\Plugin\PreviewUrlGeneratorInterface $preview_url_generator */
      $preview_url_generator = $this->previewUrlGeneratorManager->createInstance($preview_url_generator_id, $this->get('preview_url_generator_configuration') ?? []);

      return $preview_url_generator;
    }
    catch (PluginException $exception) {

      watchdog_exception('next_drupal', $exception);

      return NULL;
    }
  }

}
