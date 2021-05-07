<?php

namespace Drupal\next\Controllers;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Url;
use Drupal\next\Entity\NextSiteInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * Controller for next_site entities.
 */
class NextSiteEntityController extends ControllerBase {

  /**
   * The current request.
   *
   * @var \Symfony\Component\HttpFoundation\Request
   */
  protected $request;

  /**
   * NextSiteEntityController constructor.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The current request.
   */
  public function __construct(Request $request) {
    $this->request = $request;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('request_stack')->getCurrentRequest()
    );
  }

  /**
   * Returns the build for the environment_variables page.
   *
   * @param \Drupal\next\Entity\NextSiteInterface $next_site
   *   The next_site entity.
   *
   * @return array
   *   A render array.
   */
  public function environmentVariables(NextSiteInterface $next_site) {
    $build = [];

    $variables = [
      'NEXT_PUBLIC_DRUPAL_BASE_URL' => $this->request->getSchemeAndHttpHost(),
      'NEXT_IMAGE_DOMAIN' => $this->request->getHost(),
      'DRUPAL_SITE_ID' => $next_site->uuid(),
      'DRUPAL_FRONT_PAGE' => $this->config('system.site')->get('page.front'),
    ];

    if ($secret = $next_site->getPreviewSecret()) {
      $variables += [
        'DRUPAL_PREVIEW_SECRET' => $secret,
        'DRUPAL_CLIENT_ID' => 'Retrieve this from /admin/config/services/consumer',
        'DRUPAL_CLIENT_SECRET' => 'Retrieve this from /admin/config/services/consumer',
      ];
    }

    $build['container'] = [
      '#title' => $this->t('Environment variables'),
      '#type' => 'fieldset',
      '#title_display' => 'invisible',
    ];

    foreach ($variables as $name => $value) {
      $build['container'][$name] = [
        '#type' => 'inline_template',
        '#template' => '{{ name }}={{ value }}<br/>',
        '#context' => [
          'name' => $name,
          'value' => $value,
        ]
      ];
    }

    $build['description'] = [
      '#type' => 'html_tag',
      '#tag' => 'p',
      '#value' => $this->t('Copy and paste these values in your <em>.env</em> files.'),
    ];

    $build['actions'] = [
      '#type' => 'actions',
    ];

    $build['actions']['back'] = [
      '#type' => 'link',
      '#title' => $this->t('Back'),
      '#url' => $next_site->toUrl('collection'),
      '#attributes' => ['class' => ['button']],
    ];

    return $build;
  }

}
