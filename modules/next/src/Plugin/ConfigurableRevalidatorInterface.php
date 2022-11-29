<?php

namespace Drupal\next\Plugin;

use Drupal\Component\Plugin\ConfigurableInterface;
use Drupal\Core\Plugin\PluginFormInterface;

/**
 * Defines an interface for the configurable revalidator plugin.
 */
interface ConfigurableRevalidatorInterface extends RevalidatorInterface, PluginFormInterface, ConfigurableInterface {

}
