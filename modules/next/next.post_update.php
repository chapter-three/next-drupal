<?php

/**
 * @file
 * Post update functions for Next.
 *
 * All empty post-update hooks ensure the cache is cleared.
 * @see https://www.drupal.org/node/2960601
 */

/**
 * Add new route for validating draft URLs.
 */
function next_post_update_add_draft_route() {
}

/**
 * SECURITY: Remove automatic CORS enablement.
 *
 * The Next module previously forced CORS to be enabled with permissive default
 * settings (Access-Control-Allow-Origin: *), which created a security
 * vulnerability.
 *
 * CORS is only required if your Next.js application makes client-side browser
 * requests to your Drupal API (e.g., useEffect, useSWR, client components).
 * Most Next.js applications use server-side data fetching and do not need CORS.
 *
 * If your site requires CORS, you must now configure it explicitly in your
 * sites/default/services.yml file. See the module's CORS.md file or
 * https://www.drupal.org/node/2715637 for proper CORS configuration.
 *
 * Example CORS configuration for Next.js sites with client-side fetching:
 * @code
 * parameters:
 *   cors.config:
 *     enabled: true
 *     allowedHeaders: ['x-csrf-token', 'authorization', 'content-type', 'accept']
 *     allowedMethods: ['GET', 'POST', 'OPTIONS']
 *     allowedOrigins: ['https://www.your-site.com']
 *     exposedHeaders: false
 *     maxAge: false
 *     supportsCredentials: true
 * @endcode
 */
function next_post_update_remove_automatic_cors() {
  \Drupal::messenger()->addWarning(t('SECURITY UPDATE: The Next module no longer automatically enables CORS. If your Next.js site makes client-side API requests (useEffect, useSWR, etc.), you must configure CORS explicitly in services.yml. See the module\'s CORS.md file or <a href="@url">Drupal CORS documentation</a> for details.', [
    '@url' => 'https://www.drupal.org/node/2715637',
  ]));
}
