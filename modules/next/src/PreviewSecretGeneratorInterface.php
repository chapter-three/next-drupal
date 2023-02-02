<?php

namespace Drupal\next;

/**
 * Provides an interface for a preview secret generator.
 */
interface PreviewSecretGeneratorInterface {

  /**
   * Generates a preview secret.
   *
   * @param string $input
   *   Input to use for the secret.
   *
   * @return string
   *   The generated preview secret.
   */
  public function generate(string $input): string;

}
