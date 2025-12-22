<?php

namespace Drupal\next\Plugin\Next\SitePreviewer;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\next\Plugin\SitePreviewerBase;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Provides a site previewer plugin that redirects to the Next.js site.
 *
 * @SitePreviewer(
 *  id = "redirect",
 *  label = "Redirect",
 *  description = "Redirects the user to the Next.js site preview."
 * )
 */
class Redirect extends SitePreviewerBase implements ContainerFactoryPluginInterface {

  /**
   * The current request.
   *
   * @var \Symfony\Component\HttpFoundation\Request
   */
  protected $request;

  /**
   * Redirect constructor.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The current request.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, Request $request) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->request = $request;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('request_stack')->getCurrentRequest()
    );
  }

  /**
   * {@inheritdoc}
   */
  public function render(EntityInterface $entity, array $sites) {
    $site = reset($sites);

    // Get site from query.
    if ($site_id = $this->request->query->get('site')) {
      $_sites = array_filter($sites, function ($site) use ($site_id) {
        return $site->id() === $site_id;
      });
      $site = reset($_sites);
    }

    $preview_url = $site->getPreviewUrlForEntity($entity);

    // Return empty render array since we're redirecting.
    return [
      '#type' => 'markup',
      '#markup' => '<p>Redirecting to preview...</p>',
      '#attached' => [
        'html_head' => [
          [
            [
              '#tag' => 'meta',
              '#attributes' => [
                'http-equiv' => 'refresh',
                'content' => '0;url=' . $preview_url->toString(),
              ],
            ],
            'redirect_meta',
          ],
        ],
      ],
      // Prevent caching.
      '#cache' => ['max-age' => 0],
    ];
  }

}
