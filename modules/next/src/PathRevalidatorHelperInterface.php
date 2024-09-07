<?php

namespace Drupal\next;

use Drupal\next\Entity\NextSiteInterface;

/**
 * Path revalidator helper interface.
 */
interface PathRevalidatorHelperInterface {

  /**
   * Revalidate paths by node ids.
   *
   * @param array $nids
   *   The node id's to revalidate.
   * @param string $langcode
   *   The associated langcode.
   * @param \Drupal\next\Entity\NextSiteInterface $site
   *   The next site to revalidate the nodes on.
   * @param string $event_action
   *   The event action.
   */
  public function revalidatePathByNodeIds(
    array $nids,
    string $langcode,
    NextSiteInterface $site,
    string $event_action
  ): void;

  /**
   * Revalidate path.
   *
   * @param string $path
   *   The path of the node to revalidate.
   * @param \Drupal\next\Entity\NextSiteInterface $site
   *   The associated next site.
   * @param string $event_action
   *   The event action.
   */
  public function revalidatePath(
    string $path,
    NextSiteInterface $site,
    string $event_action
  ): void;

}
