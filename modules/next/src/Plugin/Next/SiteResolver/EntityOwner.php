<?php

declare(strict_types = 1);

namespace Drupal\next\Plugin\Next\SiteResolver;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Messenger\MessengerInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\next\Plugin\ConfigurableSiteResolverBase;
use Drupal\user\EntityOwnerInterface;
use Drupal\user\UserInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Selects the site based on the entity owner (author).
 *
 * Available for Drupal 9.3.x only: In Next.js site, you can filter resource
 * collection using:
 * @code
 * import { getResourceCollection } from "next-drupal"
 * // Fetch all Article nodes where the node authors are in a given list.
 * const nodes = await getResourceCollection<DrupalNode[]>("node--article", {
 *   params: {
 *     filter: {
 *       entity_owner: {
 *         condition: {
 *           path: "uid.id",
 *           operator: "IN",
 *           value: [
 *             // Use the users entity UUIDs to filter.
 *             "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
 *             "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy",
 *             ...
 *           ]
 *         }
 *       }
 *     }
 *   }
 * })
 * @endcode
 * The same filter can be used in `getStaticProps` and `getStaticPaths`.
 *
 * @SiteResolver(
 *  id = "entity_owner",
 *  label = "Entity owner (author)",
 *  description = "The site selector plugin selects the site based on entity owner (author).",
 * )
 */
class EntityOwner extends ConfigurableSiteResolverBase implements ContainerFactoryPluginInterface {

  /**
   * The entity type manager service.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * Constructs a new plugin instance.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin ID for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager service.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, EntityTypeManagerInterface $entity_type_manager) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->entityTypeManager = $entity_type_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition): self {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('entity_type.manager')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return [
      'sites' => [],
    ] + parent::defaultConfiguration();
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state): array {
    /** @var \Drupal\next\Entity\NextEntityTypeConfigInterface $entity */
    $entity = $form_state->getFormObject()->getEntity();

    // Check if the target entity type defines an owner.
    [$target_entity_type_id] = explode('.', $entity->id(), 2);
    $target_entity_type = $this->entityTypeManager->getDefinition($target_entity_type_id);
    $target_entity_class = $target_entity_type->getClass();

    if (!is_subclass_of($target_entity_class, EntityOwnerInterface::class)) {
      $form['status'] = [
        '#theme' => 'status_messages',
        '#message_list' => [
          MessengerInterface::TYPE_ERROR => [
            $this->t("The %plugin site resolver cannot be used with %type (%type_id) as this entity type doesn't define an owner.", [
              '%plugin' => $this->getLabel(),
              '%type' => $target_entity_type->getLabel(),
              '%type_id' => $target_entity_type_id,
            ]),
          ],
        ],
      ];
      return $form;
    }

    /** @var \Drupal\next\Entity\NextSiteInterface[] $sites */
    $sites = $this->entityTypeManager->getStorage('next_site')->loadMultiple();

    if (!count($sites)) {
      $form['status'] = [
        '#theme' => 'status_messages',
        '#message_list' => [MessengerInterface::TYPE_ERROR => [$this->t('No Next.js sites available.')]],
      ];

      return $form;
    }

    $form['sites']['#tree'] = TRUE;
    foreach ($sites as $site_id => $site) {
      $form['sites'][$site_id] = [
        '#type' => 'entity_autocomplete',
        '#title' => $this->t('Site %site', ['%site' => $site->label()]),
        '#description' => $this->t('Enter a comma separated list of user names.'),
        '#target_type' => 'user',
        '#tags' => TRUE,
        '#default_value' => $this->getUsersFromUuids($this->getConfiguration()['sites'][$site_id]),
        '#selection_handler' => 'default:user',
        '#selection_settings' => [
          'include_anonymous' => FALSE,
        ],
      ];
    }

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state): void {
    /** @var \Drupal\user\UserStorageInterface $user_storage */
    $user_storage = $this->entityTypeManager->getStorage('user');
    $this->setConfiguration([
      'sites' => array_filter(
        array_map(function (?array $user_data) use ($user_storage): array {
          $uids = array_map(function (array $user): int {
            return (int) $user['target_id'];
          }, (array) $user_data);
          $users = $uids ? array_values($user_storage->loadMultiple($uids)) : [];
          return array_map(function (UserInterface $user): string {
            return $user->uuid();
          }, $users);
        }, $form_state->getValue('sites')),
      )
    ]);
  }

  /**
   * {@inheritdoc}
   */
  public function configurationSummary(): array {
    $summary = [];

    $config = $this->getConfiguration()['sites'];
    $sites = $this->entityTypeManager->getStorage('next_site')->loadMultiple(array_keys($config));

    $items = [];
    foreach ($sites as $site_id => $site) {
      $user_labels = array_map(function (UserInterface $user): string {
        return $user->label();
      }, $this->getUsersFromUuids($config[$site_id]));
      $items[] = $this->t('@site: @users', [
        '@site' => $site->label(),
        '@users' => implode(', ', $user_labels),
      ]);
    }

    $summary[] = [
      [
        '#markup' => $this->t('Site-authors mappings'),
      ],
      [
        '#theme' => 'item_list',
        '#items' => $items,
        '#empty' => $this->t('No mappings defined yet')
      ],
    ];

    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  public function getSitesForEntity(EntityInterface $entity): array {
    $site_ids = [];

    foreach ($this->getConfiguration()['sites'] as $site_id => $user_uuids) {
      if (in_array($entity->getOwner()->uuid(), $user_uuids)) {
        $site_ids[] = $site_id;
      }
    }

    return $site_ids ? $this->entityTypeManager->getStorage('next_site')->loadMultiple($site_ids) : [];
  }

  /**
   * Returns a list of user entities given their UUIDs.
   *
   * @param array $uuids
   *   A list of user entity UUIDs.
   *
   * @return \Drupal\user\UserInterface[]
   *   A list of user entities
   */
  protected function getUsersFromUuids(array $uuids): array {
    /** @var \Drupal\user\UserStorageInterface $user_storage */
    $user_storage = $this->entityTypeManager->getStorage('user');
    $uids = $user_storage->getQuery()->condition('uuid', $uuids, 'IN')->execute();
    return $uuids ? $user_storage->loadMultiple($uids) : [];
  }

}
