/**
 * @file
 * Site preview.
 */

(function($, window, Drupal, drupalSettings) {

  Drupal.behaviors.iframePreviewLoader = {
    attach(context) {
      const $iframe = $('iframe.next-site-preview-iframe', context)

      $iframe.on('load', () => {
        $iframe.addClass('ready');
      })
    }
  }

  Drupal.behaviors.iframePreviewSyncRoute = {
    attach() {
      const { sync_route = false, skip_routes } = drupalSettings.next.iframe_preview

      if (!sync_route) {
        return;
      }

      window.addEventListener("message", (event) => {
        const { data } = event

        if (data.type !== 'NEXT_DRUPAL_ROUTE_SYNC' || !data.path) {
          return;
        }

        if (skip_routes?.includes(data.path)) {
          return;
        }

        if (window.location.pathname !== data.path) {
          window.location.href = data.path
        }
      }, false);
    }
  }
})(jQuery, window, Drupal, drupalSettings);
