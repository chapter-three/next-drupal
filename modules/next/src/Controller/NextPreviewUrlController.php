<?php

namespace Drupal\next\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\next\Exception\InvalidPreviewUrlRequest;
use Drupal\next\NextSettingsManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Defines a controller for handling preview url routes.
 */
class NextPreviewUrlController extends ControllerBase implements ContainerInjectionInterface {

  /**
   * The next settings manager.
   *
   * @var \Drupal\next\NextSettingsManagerInterface
   */
  protected NextSettingsManagerInterface $nextSettings;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static($container->get('next.settings.manager'));
  }

  /**
   * NextPreviewUrlController constructor.
   *
   * @param \Drupal\next\NextSettingsManagerInterface $next_settings
   *   The next settings manager.
   */
  public function __construct(NextSettingsManagerInterface $next_settings) {
    $this->nextSettings = $next_settings;
  }

  /**
   * Validates a preview request.
   */
  public function validate(Request $request) {
    $preview_url_generator = $this->nextSettings->getPreviewUrlGenerator();
    if (!$preview_url_generator) {
      throw new HttpException(Response::HTTP_INTERNAL_SERVER_ERROR, 'No preview url generator plugin found.');
    }

    try {
      if ($body = $preview_url_generator->validate($request)) {
        return new JsonResponse($body);
      }
    }
    catch (InvalidPreviewUrlRequest $exception) {
      throw new UnprocessableEntityHttpException($exception->getMessage());
    }
  }

}
