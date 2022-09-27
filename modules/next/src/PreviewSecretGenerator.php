<?php

namespace Drupal\next;

use Drupal\Component\Utility\Crypt;
use Drupal\Core\PrivateKey;
use Drupal\Core\Site\Settings;

/**
 * Defines a preview secret generator.
 */
class PreviewSecretGenerator implements PreviewSecretGeneratorInterface {

  /**
   * The private key service.
   *
   * @var \Drupal\Core\PrivateKey
   */
  protected PrivateKey $privateKey;

  /**
   * PreviewSecretGenerator constructor.
   *
   * @param \Drupal\Core\PrivateKey $private_key
   *   The private key service.
   */
  public function __construct(PrivateKey $private_key) {
    $this->privateKey = $private_key;
  }

  /**
   * {@inheritdoc}
   */
  public function generate(string $input): string {
    return Crypt::hmacBase64($input, $this->privateKey->get() . Settings::getHashSalt());
  }

}
