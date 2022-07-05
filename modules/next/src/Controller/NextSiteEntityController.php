<?php

namespace Drupal\next\Controller;

use Drupal\Core\Controller\ControllerBase;
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
      'required_variables' => '# Required',
      'NEXT_PUBLIC_DRUPAL_BASE_URL' => $this->request->getSchemeAndHttpHost(),
      'NEXT_IMAGE_DOMAIN' => $this->request->getHost(),
    ];

    if ($secret = $next_site->getPreviewSecret()) {
      $variables += [
        'preview_variables' => '# Required for Preview Mode',
        'DRUPAL_PREVIEW_SECRET' => $secret,
      ];
    }

    $variables += [
      'authentication_bearer' => '# Authentication (Bearer)',
      'DRUPAL_CLIENT_ID' => 'Retrieve this from /admin/config/services/consumer',
      'DRUPAL_CLIENT_SECRET' => 'Retrieve this from /admin/config/services/consumer',
    ];

    $variables += [
      'optional_variables' => '# Optional',
      'DRUPAL_SITE_ID' => $next_site->id(),
      'DRUPAL_FRONT_PAGE' => $this->config('system.site')->get('page.front'),
    ];

    $build['container'] = [
      '#title' => $this->t('Environment variables'),
      '#type' => 'fieldset',
      '#title_display' => 'invisible',
    ];

    $build['container']['heading'] = [
      '#type' => 'inline_template',
      '#template' => '# See https://next-drupal.org/docs/environment-variables<br/>',
    ];

    foreach ($variables as $name => $value) {
      $build['container'][$name] = [
        '#type' => 'inline_template',
        '#template' => "{% if value starts with '#' %} <br />{{ value }} {% else %} {{ name }}={{ value }}{% endif %}<br/>",
        '#context' => [
          'name' => $name,
          'value' => $value,
        ]
      ];
    }

    $build['description'] = [
      '#type' => 'html_tag',
      '#tag' => 'p',
      '#value' => $this->t('Copy and paste these values in your <code>.env</code> or <code>.env.local</code> files. To learn more about required and optional environment variables, refer to the <a href=":url" target="_blank">documentation</a>.', [
        ':url' => 'https://next-drupal.org/docs/environment-variables',
      ]),
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
