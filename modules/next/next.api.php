<?php

/**
 * @file
 * Hooks provided by the Next module.
 */

/**
 * @defgroup next_api Next API
 */

/**
 * @addtogroup hooks
 * @{
 */

/**
 * Alter the result of \Drupal\next\Plugin\SitePreviewerInterface::render.
 *
 * This hook is called after the preview has been assembled.
 *
 * @param array &$preview
 *   The preview renderable array from the site_previewer.
 * @param array $context
 *   Context in which the entity is previewed with the following keys:
 *   - 'plugin': the site_previewer plugin.
 *   - 'entity': the entity in preview.
 *   - 'sites': the sites for this entity.
 *   - 'original_build': the original un-altered build.
 *
 * @ingroup next_api
 */
function hook_next_site_preview_alter(array &$preview, array $context) {
  // Add the entity title before the preview.
  $preview['title'] = [
    '#markup' => $context['entity']->label(),
    '#weight' => -100,
  ];
}

/**
 * @} End of "addtogroup hooks".
 */
