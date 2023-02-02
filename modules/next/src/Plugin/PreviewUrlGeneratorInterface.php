<?php

namespace Drupal\next\Plugin;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Url;
use Drupal\next\Entity\NextSiteInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * Defines an interface for the preview_url_generator plugin.
 */
interface PreviewUrlGeneratorInterface {

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
   * Generates a preview url for the given next_site and entity.
   *
   * @param \Drupal\next\Entity\NextSiteInterface $next_site
   *   The next site entity.
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity being previewed.
   * @param string|null $resource_version
   *   The resource version for the entity.
   *
   * @return \Drupal\Core\Url|null
   *   The generated preview url.
   */
  public function generate(NextSiteInterface $next_site, EntityInterface $entity, string $resource_version = NULL): ?Url;

  /**
   * Validates the preview url.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The http request.
   *
   * @throws \Drupal\next\Exception\InvalidPreviewUrlRequest
   */
  public function validate(Request $request);

}
