<?php

namespace Drupal\next\Plugin\Next\SiteResolver;

use Drupal\Core\Entity\EntityFieldManagerInterface;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Form\SubformStateInterface;
use Drupal\Core\Messenger\MessengerInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\next\Plugin\ConfigurableSiteResolverBase;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a site resolver plugin for entity reference fields.
 *
 * @SiteResolver(
 *  id = "entity_reference_field",
 *  label = "Entity reference field",
 *  description = "This plugin allows you to select an entity reference field from which to resolve the Next.js site."
 * )
 */
class EntityReferenceField extends ConfigurableSiteResolverBase implements ContainerFactoryPluginInterface {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The entity field manager.
   *
   * @var \Drupal\Core\Entity\EntityFieldManagerInterface
   */
  protected $entityFieldManager;

  /**
   * DefaultSiteResolver constructor.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin ID for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\Core\Entity\EntityFieldManagerInterface $entity_field_manager
   *   The entity field manager.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, EntityTypeManagerInterface $entity_type_manager, EntityFieldManagerInterface $entity_field_manager) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->entityTypeManager = $entity_type_manager;
    $this->entityFieldManager = $entity_field_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('entity_type.manager'),
      $container->get('entity_field.manager')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'field_name' => [],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    if ($form_state instanceof SubformStateInterface) {
      $form_state = $form_state->getCompleteFormState();
    }

    /** @var \Drupal\next\Entity\NextEntityTypeConfigInterface $entity */
    $entity = $form_state->getFormObject()->getEntity();
    if (!$entity) {
      $form['status'] = [
        '#theme' => 'status_messages',
        '#message_list' => [MessengerInterface::TYPE_ERROR => [$this->t('Invalid entity type selected.')]],
      ];

      return $form;
    }

    [$entity_type_id, $bundle] = explode('.', $entity->id());

    $definitions = array_filter($this->entityFieldManager->getFieldDefinitions($entity_type_id, $bundle), function (FieldDefinitionInterface $definition) {
      if ($definition->getType() !== "entity_reference") {
        return FALSE;
      }

      return $definition->getSetting('target_type') === "next_site";
    });

    if (!count($definitions)) {
      $form['status'] = [
        '#theme' => 'status_messages',
        '#message_list' => [MessengerInterface::TYPE_ERROR => [$this->t('No next_site entity reference fields found for the selected entity type.')]],
      ];

      return $form;
    }

    $form['field_name'] = [
      '#title' => $this->t('Field'),
      '#type' => 'select',
      '#options' => array_combine(array_keys($definitions), array_keys($definitions)),
      '#required' => TRUE,
      '#default_value' => $this->configuration['field_name'],
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
    $this->configuration['field_name'] = $form_state->getValue('field_name');
  }

  /**
   * {@inheritdoc}
   */
  public function configurationSummary() {
    $summary = [];

    $summary[] = $this->t('Field name: @field_name', [
      '@field_name' => $this->configuration['field_name'],
    ]);

    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  public function getSitesForEntity(EntityInterface $entity) {
    return $entity->{$this->configuration['field_name']}->referencedEntities();
  }

}
