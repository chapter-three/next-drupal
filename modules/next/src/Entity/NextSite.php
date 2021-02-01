<?php

namespace Drupal\next\Entity;

use Drupal\Core\Config\Entity\ConfigEntityBase;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityPublishedInterface;
use Drupal\Core\Entity\RevisionableInterface;
use Drupal\Core\Url;

/**
 * Defines the next_site config entity.
 *
 * @ConfigEntityType(
 *   id = "next_site",
 *   label = @Translation("Next.js site"),
 *   label_collection = @Translation("Next.js sites"),
 *   label_singular = @Translation("Next.js site"),
 *   label_plural = @Translation("Next.js sites"),
 *   label_count = @PluralTranslation(
 *     singular = "@count Next.js site",
 *     plural = "@count Next.js sites",
 *   ),
 *   handlers = {
 *     "list_builder" = "Drupal\next\NextSiteListBuilder",
 *     "form" = {
 *       "add" = "Drupal\next\Form\NextSiteForm",
 *       "edit" = "Drupal\next\Form\NextSiteForm",
 *       "delete" = "Drupal\next\Form\NextSiteDeleteForm"
 *     },
 *     "route_provider" = {
 *       "html" = "Drupal\Core\Entity\Routing\AdminHtmlRouteProvider"
 *     },
 *   },
 *   config_prefix = "next_site",
 *   admin_permission = "administer site configuration",
 *   static_cache = TRUE,
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "label",
 *     "uuid" = "uuid"
 *   },
 *   config_export = {
 *     "id",
 *     "label",
 *     "base_url",
 *     "preview_url",
 *     "preview_secret",
 *   },
 *   links = {
 *     "add-form" = "/admin/config/services/next/sites/add",
 *     "edit-form" = "/admin/config/services/next/sites/{next_site}/edit",
 *     "delete-form" = "/admin/config/services/next/sites/{next_site}/delete",
 *     "collection" = "/admin/config/services/next"
 *   }
 * )
 */
class NextSite extends ConfigEntityBase implements NextSiteInterface {

  /**
   * The base URL.
   *
   * @var string
   */
  protected $base_url;

  /**
   * The preview url.
   *
   * @var string
   */
  protected $preview_url;

  /**
   * The preview secret.
   *
   * @var string
   */
  protected $preview_secret;

  /**
   * {@inheritdoc}
   */
  public function getBaseUrl(): ?string {
    return $this->base_url;
  }

  /**
   * {@inheritdoc}
   */
  public function setBaseUrl(string $base_url): NextSiteInterface {
    $this->set('base_url', $base_url);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getPreviewUrl(): ?string {
    return $this->preview_url;
  }

  /**
   * {@inheritdoc}
   */
  public function setPreviewUrl(string $preview_url): NextSiteInterface {
    $this->set('preview_url', $preview_url);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getPreviewSecret(): ?string {
    return $this->preview_secret;
  }

  /**
   * {@inheritdoc}
   */
  public function setPreviewSecret(string $preview_secret): NextSiteInterface {
    $this->set('preview_secret', $preview_secret);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getPreviewUrlForEntity(EntityInterface $entity): Url {
    $query = [
      'secret' => $this->preview_secret,
      'slug' => $entity->toUrl()->toString(),
    ];

    // Handle revisionable entity types.
    if ($entity->getEntityType()->isRevisionable()) {
      $query['resourceVersion'] = $entity->isLatestRevision() ? "rel:latest-version" : "id:{$entity->getRevisionId()}";
    }

    return Url::fromUri($this->preview_url, [
      'query' => $query,
    ]);
  }

  /**
   * {@inheritdoc}
   */
  public function getLiveUrlForEntity(EntityInterface $entity): ?Url {
    // Check if entity is published.
    if ($entity instanceof EntityPublishedInterface && !$entity->isPublished()) {
      return NULL;
    }

    return Url::fromUri("{$this->base_url}{$entity->toUrl()->toString()}");
  }

}
