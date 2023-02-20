<?php

namespace Drupal\next\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\node\Entity\Node;
use Drupal\next\NextEntityTypeManager;
use Drupal\next\Plugin\SitePreviewerManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Defines a controller for the site preview of a node.
 *
 * @internal
 *   This is an internal part of Acquia CMS Headless and may be changed or
 *   removed at any time without warning. External code should not extend or
 *   use this class in any way!
 */
class SitePreviewController extends ControllerBase
{
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

    public function __construct(NextEntityTypeManager $nextEntityTypeManager, SitePreviewerManagerInterface $sitePreviewerManager)
    {
        $this->nextEntityTypeManager = $nextEntityTypeManager;
        $this->sitePreviewerManager = $sitePreviewerManager;
    }

    /**
     * {@inheritdoc}
     */
    public static function create(ContainerInterface $container)
    {
        return new static(
      $container->get('next.entity_type.manager'),
      $container->get('plugin.manager.next.site_previewer')
    );
    }

    /**
     *  Displays the node title for preview.
     * @param  Node   $node               [description]
     * @return string       [description]
     */
    public function nodePreviewTitle(Node $node)
    {
        return 'Preview: ' . $node->getTitle();
    }

    /**
     * Displays the next.js site preview of a node.
     */
    public function nodePreview(Node $node)
    {
        $storage = \Drupal::entityTypeManager()->getStorage($node->getEntityTypeId());
        $revision = $storage->loadRevision($storage->getLatestRevisionId($node->id()));

        $next_entity_type_config = $this->nextEntityTypeManager->getConfigForEntityType($revision->getEntityTypeId(), $revision->bundle());
        $sites = $next_entity_type_config->getSiteResolver()->getSitesForEntity($revision);
        if (!count($sites)) {
            throw new \Exception('Next.js sites for the entity could not be resolved.');
        }

        $config = $this->config('next.settings');
        $site_previewer_id = $config->get('site_previewer') ?? 'iframe';

        /** @var \Drupal\next\Plugin\SitePreviewerInterface $site_previewer */
        $site_previewer = $this->sitePreviewerManager->createInstance($site_previewer_id, $config->get('site_previewer_configuration') ?? []);
        if (!$site_previewer) {
            throw new PluginNotFoundException('Invalid site previewer.');
        }

        // Build preview.
        $preview = $site_previewer->render($revision, $sites);

        $context = [
          'plugin' => $site_previewer,
          'entity' => $revision,
          'sites' => $sites,
        ];

        // Allow modules to alter the preview.
        $this->moduleHandler()->alter('next_site_preview', $preview, $context);

        return $preview;
    }
}
