<?php

namespace Drupal\next\Entity;

use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\Core\Config\Entity\ConfigEntityBase;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityPublishedInterface;
use Drupal\Core\TypedData\TranslatableInterface;
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
 *       "html" = "Drupal\next\Routing\NextSiteHtmlRouteProvider"
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
 *     "environment-variables" =
 *   "/admin/config/services/next/sites/{next_site}/env",
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
    // Anonymous users do not have access to the preview url.
    // Same for authenticated users with no additional roles, since we assume no scope.
    if (\Drupal::currentUser()->isAnonymous() || (!count(\Drupal::currentUser()->getRoles(TRUE)) && \Drupal::currentUser()->id() !== "1")) {
      return $this->getLiveUrlForEntity($entity);
    }

    // Handle revisionable entity types.
    $resource_version = NULL;
    /** @var \Drupal\next\NextEntityTypeManagerInterface $next_entity_type_manager */
    $next_entity_type_manager = \Drupal::service('next.entity_type.manager');
    if ($next_entity_type_manager->isEntityRevisionable($entity)) {
      /** @var \Drupal\Core\Entity\RevisionableInterface $entity */
      $rel = NULL;

      // In Drupal terms, a "working copy" is the latest revision. It may or may not
      // be a "default" revision. This revision is the working copy because it is
      // the revision to which new work will be applied. In other words, it denotes
      // the most recent revision which might be considered a work-in-progress.
      // @see \Drupal\jsonapi\Revisions\VersionByRel
      if ($entity->isLatestRevision()) {
        $rel = 'working-copy';
      }

      // In Drupal terms, the "latest version" is the latest "default" revision. It
      // may or may not have later revisions after it, as long as none of them are
      // "default" revisions. This revision is the latest version because it is the
      // last revision where work was considered finished. Typically, this means
      // that it is the most recent "published" revision.
      // @see \Drupal\jsonapi\Revisions\VersionByRel
      if ($entity->isDefaultRevision()) {
        $rel = 'latest-version';
      }
      $resource_version = $rel ? "rel:$rel" : "id:{$entity->getRevisionId()}";
    }

    // TODO: Extract this to a service.
    /** @var \Drupal\next\NextSettingsManagerInterface $next_settings */
    $next_settings = \Drupal::service('next.settings.manager');
    $preview_url_generator = $next_settings->getPreviewUrlGenerator();
    if (!$preview_url_generator) {
      throw new PluginNotFoundException('Invalid preview url generator.');
    }

    $preview_url = $preview_url_generator->generate($this, $entity, $resource_version);

    // If no preview url has been generated, show the live url.
    if (!$preview_url) {
      return $this->getLiveUrlForEntity($entity);
    }

    $query = $preview_url->getOption('query');

    // Add the plugin to the query.
    // This allows next.js app to determine the preview strategy based on the plugin.
    $query['plugin'] = $preview_url_generator->getId();

    // Add the locale to the query.
    if ($entity instanceof TranslatableInterface) {
      $query['locale'] = $entity->language()->getId();
      $query['defaultLocale'] = \Drupal::languageManager()
        ->getDefaultLanguage()
        ->getId();
    }

    $query['resourceVersion'] = $resource_version;

    $preview_url->setOption('query', $query);

    return $preview_url;
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
