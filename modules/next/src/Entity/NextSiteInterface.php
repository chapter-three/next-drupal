<?php

namespace Drupal\next\Entity;

use Drupal\Core\Config\Entity\ConfigEntityInterface;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Url;

/**
 * Provides an interface for NextSite entity definitions.
 */
interface NextSiteInterface extends ConfigEntityInterface {

  /**
   * Returns the base_url for the next_site.
   *
   * @return string
   *   The base_url for the next_site.
   */
  public function getBaseUrl(): ?string;

  /**
   * Sets the base_url for the next_site.
   *
   * @param string $base_url
   *   The base_url.
   *
   * @return \Drupal\next\Entity\NextSiteInterface
   *   The next_site entity.
   */
  public function setBaseUrl(string $base_url): self;

  /**
   * Returns the preview_url for the next_site.
   *
   * @return string
   *   The preview_url for the next_site.
   */
  public function getPreviewUrl(): ?string;

  /**
   * Sets the preview_url for the next_site.
   *
   * @param string $preview_url
   *   The preview_url.
   *
   * @return \Drupal\next\Entity\NextSiteInterface
   *   The next_site entity.
   */
  public function setPreviewUrl(string $preview_url): self;

  /**
   * Returns the preview_secret for the next_site.
   *
   * @return string
   *   The preview_secret for the next_site.
   */
  public function getPreviewSecret(): ?string;

  /**
   * Sets the preview_secret for the next_site.
   *
   * @param string $preview_secret
   *   The preview_secret.
   *
   * @return \Drupal\next\Entity\NextSiteInterface
   *   The next_site entity.
   */
  public function setPreviewSecret(string $preview_secret): self;

  /**
   * Returns the preview url for the given entity.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity.
   *
   * @return \Drupal\Core\Url
   *   The generated preview url.
   */
  public function getPreviewUrlForEntity(EntityInterface $entity): Url;

  /**
   * Returns the live url for the given entity.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity.
   *
   * @return \Drupal\Core\Url|null
   *   The generated live url.
   */
  public function getLiveUrlForEntity(EntityInterface $entity): ?Url;

  /**
   * Returns the revalidate_url for the next_site.
   *
   * @return string
   *   The revalidate_url for the next_site.
   */
  public function getRevalidateUrl(): ?string;

  /**
   * Sets the revalidate_url for the next_site.
   *
   * @param string $revalidate_url
   *   The revalidate_url.
   *
   * @return \Drupal\next\Entity\NextSiteInterface
   *   The next_site entity.
   */
  public function setRevalidateUrl(string $revalidate_url): self;

  /**
   * Returns the revalidate_secret for the next_site.
   *
   * @return string
   *   The revalidate_secret for the next_site.
   */
  public function getRevalidateSecret(): ?string;

  /**
   * Sets the revalidate_secret for the next_site.
   *
   * @param string $revalidate_secret
   *   The revalidate_secret.
   *
   * @return \Drupal\next\Entity\NextSiteInterface
   *   The next_site entity.
   */
  public function setRevalidateSecret(string $revalidate_secret): self;

  /**
   * Returns the revalidate url for given path.
   *
   * @param string $path
   *   The path.
   *
   * @return \Drupal\Core\Url|null
   *   The revalidate url.
   */
  public function getRevalidateUrlForPath(string $path): ?Url;

}
