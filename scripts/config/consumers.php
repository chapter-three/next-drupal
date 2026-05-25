<?php

/**
 * Borrowed with kudos from
 * https://github.com/octahedroid/drupal-decoupled-project/blob/10.3.x/scripts/consumers.php
 *
 * Very liberal with permissions/secrets here - only intended for local development
 */

use Drupal\Component\Utility\Crypt;
use Drupal\Component\Utility\Random;
use Drupal\Core\File\FileSystemInterface;

$random = new Random();
$consumerStorage = \Drupal::entityTypeManager()->getStorage('consumer');

$previewerClientId = Crypt::randomBytesBase64();
$previewerClientSecret = $random->word(8);
$consumerStorage->create([
  'client_id' => 'next_consumer',
  'client_secret ' => 'secret',
  'label' => 'Next Consumer',
  'user_id' => 1,
  'third_party' => TRUE,
  'is_default' => FALSE,
])->save();

$directory = '../keys';

if (create_directory($directory)) {
  echo 'Keys dir created succesfully' . PHP_EOL;
} else {
  echo 'Failed to create directory' . PHP_EOL;
}

\Drupal::service('simple_oauth.key.generator')->generateKeys($directory);

function create_directory($directory)
{
  // Get the file system service.
  $file_system = \Drupal::service('file_system');

  // Check if the directory exists and create it if it doesn't.
  if (!$file_system->prepareDirectory($directory, FileSystemInterface::CREATE_DIRECTORY | FileSystemInterface::MODIFY_PERMISSIONS)) {
    return FALSE;
  }

  return TRUE;
}