<?php

namespace Drupal\next\Plugin\Next\SiteResolver;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Messenger\MessengerInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\next\Plugin\ConfigurableSiteResolverBase;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides the site selector site resolver plugin.
 *
 * @SiteResolver(
 *  id = "site_selector",
 *  label = "Site selector",
 *  description = "The site selector plugin allows you to manually select the Next.js sites for the entity type."
 * )
 */
class SiteSelector extends ConfigurableSiteResolverBase implements ContainerFactoryPluginInterface {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

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
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, EntityTypeManagerInterface $entity_type_manager) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->entityTypeManager = $entity_type_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
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
  public function defaultConfiguration() {
    return [
      'sites' => [],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    /** @var \Drupal\next\Entity\NextSiteInterface[] $sites */
    $sites = $this->entityTypeManager->getStorage('next_site')->loadMultiple();

    if (!count($sites)) {
      $form['status'] = [
        '#theme' => 'status_messages',
        '#message_list' => [MessengerInterface::TYPE_ERROR => [$this->t('No Next.js sites available.')]],
      ];

      return $form;
    }

    $site_options = [];
    foreach ($sites as $site) {
      $site_options[$site->id()] = $site->label();
    }

    $form['sites'] = [
      '#title' => $this->t('Next.js sites'),
      '#type' => 'checkboxes',
      '#options' => $site_options,
      '#required' => TRUE,
      '#default_value' => $this->configuration['sites'],
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
    $this->configuration['sites'] = $form_state->getValue('sites');
  }

  /**
   * {@inheritdoc}
   */
  public function configurationSummary() {
    $summary = [];

    $summary[] = $this->t('Sites: @sites', [
      '@sites' => implode(', ', array_filter($this->configuration['sites'])),
    ]);

    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  public function getSitesForEntity(EntityInterface $entity) {
    return $this->entityTypeManager->getStorage('next_site')->loadMultiple(array_filter($this->configuration['sites']));
  }

}
