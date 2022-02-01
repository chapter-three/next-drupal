<?php

namespace Drupal\next\Render\MainContent;

use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\Component\Plugin\PluginManagerInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Controller\TitleResolverInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Render\MainContent\HtmlRenderer as CoreHtmlRenderer;
use Drupal\Core\Render\RenderCacheInterface;
use Drupal\Core\Render\RendererInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Theme\ThemeManagerInterface;
use Drupal\next\NextEntityTypeManager;
use Drupal\next\Plugin\SitePreviewerManagerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * Overrides the core HTML renderer to handle iframe previews.
 */
class HtmlRenderer extends CoreHtmlRenderer {

  /**
   * The config factory.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  /**
   * The next entity type manager.
   *
   * @var \Drupal\next\NextEntityTypeManager
   */
  protected $nextEntityTypeManager;

  /**
   * The site previewer manager.
   *
   * @var \Drupal\next\Plugin\SitePreviewerManagerInterface
   */
  protected $sitePreviewerManager;

  /**
   * The theme manager.
   *
   * @var \Drupal\Core\Theme\ThemeManagerInterface
   */
  protected $themeManager;

  /**
   * Constructs a new HtmlRenderer.
   *
   * @param \Drupal\Core\Controller\TitleResolverInterface $title_resolver
   *   The title resolver.
   * @param \Drupal\Component\Plugin\PluginManagerInterface $display_variant_manager
   *   The display variant manager.
   * @param \Symfony\Component\EventDispatcher\EventDispatcherInterface $event_dispatcher
   *   The event dispatcher.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   The module handler.
   * @param \Drupal\Core\Render\RendererInterface $renderer
   *   The renderer service.
   * @param \Drupal\Core\Render\RenderCacheInterface $render_cache
   *   The render cache service.
   * @param array $renderer_config
   *   The renderer configuration array.
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The config factory.
   * @param \Drupal\next\NextEntityTypeManager $next_entity_type_manager
   *   The Next entity type manager.
   * @param \Drupal\next\Plugin\SitePreviewerManagerInterface $site_previewer_manager
   *   The site previewer manager.
   * @param \Drupal\Core\Theme\ThemeManagerInterface $theme_manager
   *   The theme manager.
   */
  public function __construct(TitleResolverInterface $title_resolver, PluginManagerInterface $display_variant_manager, EventDispatcherInterface $event_dispatcher, ModuleHandlerInterface $module_handler, RendererInterface $renderer, RenderCacheInterface $render_cache, array $renderer_config, ConfigFactoryInterface $config_factory, NextEntityTypeManager $next_entity_type_manager, SitePreviewerManagerInterface $site_previewer_manager, ThemeManagerInterface $theme_manager) {
    parent::__construct($title_resolver, $display_variant_manager, $event_dispatcher, $module_handler, $renderer, $render_cache, $renderer_config);
    $this->configFactory = $config_factory;
    $this->nextEntityTypeManager = $next_entity_type_manager;
    $this->sitePreviewerManager = $site_previewer_manager;
    $this->themeManager = $theme_manager;
  }

  /**
   * {@inheritdoc}
   */
  protected function prepare(array $main_content, Request $request, RouteMatchInterface $route_match) {
    $build = parent::prepare($main_content, $request, $route_match);
    $entity = $this->nextEntityTypeManager->getEntityFromRouteMatch($route_match);

    if (!$entity) {
      return $build;
    }

    // TODO: Make this configurable?
    $entity_type_id = $entity->getEntityTypeId();
    $revision_routes = $entity->getEntityType()->isRevisionable() ? [
      "entity.$entity_type_id.revision",
      "entity.$entity_type_id.latest_version"
    ] : [];
    $routes = array_merge(["entity.$entity_type_id.canonical"], $revision_routes);

    if (!in_array($route_match->getRouteName(), $routes)) {
      return $build;
    }

    $next_entity_type_config = $this->nextEntityTypeManager->getConfigForEntityType($entity->getEntityTypeId(), $entity->bundle());
    if (!$next_entity_type_config) {
      return $build;
    }

    $sites = $next_entity_type_config->getSiteResolver()->getSitesForEntity($entity);
    if (!count($sites)) {
      throw new \Exception('Next.js sites for the entity could not be resolved.');
    }

    $config = $this->configFactory->get('next.settings');
    $site_previewer_id = $config->get('site_previewer');
    /** @var \Drupal\next\Plugin\SitePreviewerInterface $site_previewer */
    $site_previewer = $this->sitePreviewerManager->createInstance($site_previewer_id, $config->get('site_previewer_configuration') ?? []);
    if (!$site_previewer) {
      throw new PluginNotFoundException('Invalid site previewer.');
    }

    // Build preview.
    $preview = $site_previewer->render($entity, $sites);

    $context = [
      'plugin' => $site_previewer,
      'original_build' => $build,
      'entity' => $entity,
      'sites' => $sites,
    ];

    // Allow modules to alter the preview.
    $this->moduleHandler->alter('next_site_preview', $preview, $context);

    [$page, $title] = $build;
    $page['content'] = $preview;

    return [$page, $title];
  }

}
