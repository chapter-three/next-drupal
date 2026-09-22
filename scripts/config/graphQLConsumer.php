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

// Create a user with role next_js
$user = \Drupal::service('entity_type.manager')->getStorage('user')->create([
  'name' => 'next',
  'mail' => 'next@ddev.site',
  'password' => 'next',
  'roles' => ['next_js_site'],
  'status' => 1,
]);
$user->save();

$previewerClientId = Crypt::randomBytesBase64();
$previewerClientSecret = $random->word(8);
$consumer = $consumerStorage->create([
  'client_id' => 'next_consumer',
  'secret' => 'secret',
  'label' => 'Next.js site',
  'user_id' => $user->id(),
  'grant_types' => ['client_credentials'],
  'scopes' => ['nextjs_site'],
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
