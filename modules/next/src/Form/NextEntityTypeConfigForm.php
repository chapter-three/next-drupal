<?php

namespace Drupal\next\Form;

use Drupal\Core\Entity\ContentEntityTypeInterface;
use Drupal\Core\Entity\EntityForm;
use Drupal\Core\Entity\EntityTypeBundleInfoInterface;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Form\SubformState;
use Drupal\next\Plugin\ConfigurableRevalidatorInterface;
use Drupal\next\Plugin\ConfigurableSiteResolverInterface;
use Drupal\next\Plugin\RevalidatorManagerInterface;
use Drupal\next\Plugin\SiteResolverManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Base form for next_entity_type_config.
 */
class NextEntityTypeConfigForm extends EntityForm {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The site resolver manager.
   *
   * @var \Drupal\next\Plugin\SiteResolverManagerInterface
   */
  protected $siteResolverManager;

  /**
   * The entity type bundle info.
   *
   * @var \Drupal\Core\Entity\EntityTypeBundleInfoInterface
   */
  protected $entityTypeBundleInfo;

  /**
   * The revalidator manager.
   *
   * @var \Drupal\next\Plugin\RevalidatorManagerInterface
   */
  protected $revalidatorManager;

  /**
   * NextEntityTypeConfigForm constructor.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\Core\Entity\EntityTypeBundleInfoInterface $entity_type_bundle_info
   *   The entity type bundle info.
   * @param \Drupal\next\Plugin\SiteResolverManagerInterface $site_resolver_manager
   *   The site resolver manager.
   * @param \Drupal\next\Plugin\RevalidatorManagerInterface $revalidator_manager
   *   The revalidator manager.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, EntityTypeBundleInfoInterface $entity_type_bundle_info, SiteResolverManagerInterface $site_resolver_manager, RevalidatorManagerInterface $revalidator_manager = NULL) {
    if (!$revalidator_manager) {
      @trigger_error('Calling NextEntityTypeConfigForm::__construct() without the $revalidator_manager argument is deprecated in next:1.4.0. The $revalidator_manager argument will be required in next:2.0.0. See https://www.drupal.org/project/next/releases/1.4.0', E_USER_DEPRECATED);
      $revalidator_manager = \Drupal::service('plugin.manager.next.revalidator');
    }

    $this->entityTypeManager = $entity_type_manager;
    $this->entityTypeBundleInfo = $entity_type_bundle_info;
    $this->siteResolverManager = $site_resolver_manager;
    $this->revalidatorManager = $revalidator_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static($container->get('entity_type.manager'), $container->get('entity_type.bundle.info'), $container->get('plugin.manager.next.site_resolver'), $container->get('plugin.manager.next.revalidator'));
  }

  /**
   * {@inheritdoc}
   */
  public function form(array $form, FormStateInterface $form_state) {
    $form = parent::form($form, $form_state);

    /** @var \Drupal\next\Entity\NextEntityTypeConfigInterface $entity */
    $entity = $this->entity;

    $form['id'] = [
      '#title' => $this->t('Entity type'),
      '#type' => 'select',
      '#options' => $this->getEntityTypeOptions(),
      '#default_value' => $entity->id(),
      '#disabled' => !$entity->isNew(),
      '#required' => TRUE,
      '#limit_validation_errors' => [['id']],
      '#submit' => ['::submitId'],
      '#executes_submit_callback' => TRUE,
      '#ajax' => [
        'callback' => '::ajaxReplaceSettingsForm',
        'wrapper' => 'settings-container',
        'method' => 'replace',
      ],
    ];

    $form['settings_container'] = [
      '#type' => 'container',
      '#prefix' => '<div id="settings-container">',
      '#suffix' => '</div>',
    ];

    if ($entity->id()) {
      $form['settings_container']['settings'] = [
        '#type' => 'vertical_tabs',
        '#title' => $this->t('Settings'),
      ];

      $form['preview_mode'] = [
        '#title' => $this->t('Preview Mode'),
        '#description' => $this->t('Configure preview mode the entity type.'),
        '#type' => 'details',
        '#group' => 'settings',
      ];

      $form['preview_mode']['site_resolver'] = [
        '#title' => $this->t('Plugin'),
        '#description' => $this->t('Select a plugin to use for resolving the preview site for this entity type.'),
        '#type' => 'select',
        '#options' => array_merge(['' => $this->t('None')], array_column($this->siteResolverManager->getDefinitions(), 'label', 'id')),
        '#default_value' => $entity->getSiteResolver() ? $entity->getSiteResolver()->getId() : NULL,
        '#limit_validation_errors' => [['site_resolver']],
        '#submit' => ['::submitSiteResolver'],
        '#executes_submit_callback' => TRUE,
        '#ajax' => [
          'callback' => '::ajaxReplaceSiteResolverSettingsForm',
          'wrapper' => 'site-resolver-settings',
          'method' => 'replace',
        ],
      ];

      $form['preview_mode']['site_resolver_settings_container'] = [
        '#type' => 'container',
        '#prefix' => '<div id="site-resolver-settings">',
        '#suffix' => '</div>',
      ];

      $site_resolver = $entity->getSiteResolver();
      if ($site_resolver instanceof ConfigurableSiteResolverInterface) {
        $form['configuration'] = [];
        $subform_state = SubformState::createForSubform($form['configuration'], $form, $form_state);
        $form['preview_mode']['site_resolver_settings_container']['configuration'] = $site_resolver->buildConfigurationForm($form['configuration'], $subform_state);
      }

      $form['revalidation'] = [
        '#title' => $this->t('On-demand Revalidation'),
        '#description' => $this->t('Configure on-demand revalidation for the entity type.'),
        '#type' => 'details',
        '#group' => 'settings',
      ];

      $form['revalidation']['revalidator'] = [
        '#title' => $this->t('Plugin'),
        '#description' => $this->t('Select a plugin to use for on-demand revalidation.'),
        '#type' => 'select',
        '#options' => array_merge(['' => $this->t('None')], array_column($this->revalidatorManager->getDefinitions(), 'label', 'id')),
        '#default_value' => $entity->getRevalidator() ? $entity->getRevalidator()
          ->getId() : NULL,
        '#limit_validation_errors' => [['revalidator']],
        '#submit' => ['::submitRevalidator'],
        '#executes_submit_callback' => TRUE,
        '#ajax' => [
          'callback' => '::ajaxReplaceRevalidatorSettingsForm',
          'wrapper' => 'revalidator-settings',
          'method' => 'replace',
        ],
      ];

      $form['revalidation']['revalidator_settings_container'] = [
        '#type' => 'container',
        '#prefix' => '<div id="revalidator-settings">',
        '#suffix' => '</div>',
      ];

      $revalidator = $entity->getRevalidator();
      if ($revalidator instanceof ConfigurableRevalidatorInterface) {
        $form['revalidator_configuration'] = [];
        $subform_state = SubformState::createForSubform($form['revalidator_configuration'], $form, $form_state);
        $form['revalidation']['revalidator_settings_container']['revalidator_configuration'] = $revalidator->buildConfigurationForm($form['revalidator_configuration'], $subform_state);
      }
    }

    return $form;
  }

  /**
   * Handles submit call when id is selected.
   */
  public function submitId(array $form, FormStateInterface $form_state) {
    $this->entity = $this->buildEntity($form, $form_state);
    $form_state->setRebuild();
  }

  /**
   * Handles switching the id selector.
   */
  public function ajaxReplaceSettingsForm($form, FormStateInterface $form_state) {
    return $form['settings_container'];
  }

  /**
   * Handles submit call when site resolver is selected.
   */
  public function submitSiteResolver(array $form, FormStateInterface $form_state) {
    $this->entity = $this->buildEntity($form, $form_state);
    $form_state->setRebuild();
  }

  /**
   * Handles switching the site resolver selector.
   */
  public function ajaxReplaceSiteResolverSettingsForm($form, FormStateInterface $form_state) {
    return $form['preview_mode']['site_resolver_settings_container'];
  }

  /**
   * Handles submit call when revalidator is selected.
   */
  public function submitRevalidator(array $form, FormStateInterface $form_state) {
    $this->entity = $this->buildEntity($form, $form_state);
    $form_state->setRebuild();
  }

  /**
   * Handles switching the revalidator selector.
   */
  public function ajaxReplaceRevalidatorSettingsForm($form, FormStateInterface $form_state) {
    return $form['revalidation']['revalidator_settings_container'];
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    parent::validateForm($form, $form_state);

    /** @var \Drupal\next\Entity\NextEntityTypeConfigInterface $entity */
    $entity = $this->entity;

    // Validate already configured entity types.
    if ($entity->isNew() && $this->entityTypeManager->getStorage('next_entity_type_config')->load($entity->id())) {
      $form_state->setErrorByName('id', $this->t('This entity type has already been configured.'));
      return;
    }

    $site_resolver = $entity->getSiteResolver();
    if ($site_resolver instanceof ConfigurableSiteResolverInterface) {
      $site_resolver->validateConfigurationForm($form, $form_state);
    }

    $revalidator = $entity->getRevalidator();
    if ($revalidator instanceof ConfigurableRevalidatorInterface) {
      $revalidator->validateConfigurationForm($form, $form_state);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);

    /** @var \Drupal\next\Entity\NextEntityTypeConfigInterface $entity */
    $entity = $this->entity;
    $site_resolver = $entity->getSiteResolver();
    $revalidator = $entity->getRevalidator();

    if ($site_resolver instanceof ConfigurableSiteResolverInterface) {
      $site_resolver->submitConfigurationForm($form, $form_state);
    }

    if ($revalidator instanceof ConfigurableRevalidatorInterface) {
      $revalidator->submitConfigurationForm($form, $form_state);
      $this->entity->getRevalidatorPluginCollection()->addInstanceId($revalidator->getId(), $revalidator->getConfiguration());
    }

    $entity->save();
  }

  /**
   * {@inheritdoc}
   */
  public function save(array $form, FormStateInterface $form_state) {
    /** @var \Drupal\next\Entity\NextEntityTypeConfigInterface $entity */
    $entity = $this->entity;
    $status = $entity->save();

    $this->messenger()
      ->addStatus($this->t('Entity type config for %label has been %action.', [
        '%label' => $entity->label(),
        '%action' => $status === SAVED_NEW ? 'added' : 'updated',
      ]));

    $form_state->setRedirectUrl($entity->toUrl('collection'));
  }

  /**
   * Returns an array of entity types.
   *
   * @return \Drupal\Core\Entity\EntityTypeInterface[]
   *   An array of entity types.
   */
  protected function getEntityTypes() {
    $entity_types = array_filter($this->entityTypeManager->getDefinitions(), function (EntityTypeInterface $entity_type) {
      return $entity_type instanceof ContentEntityTypeInterface;
    });

    usort($entity_types, function (ContentEntityTypeInterface $a, ContentEntityTypeInterface $b) {
      return strcmp($a->getLabel(), $b->getLabel());
    });

    return $entity_types;
  }

  /**
   * Returns an options-ready entity type array.
   *
   * @return array
   *   An array of entity type options.
   */
  protected function getEntityTypeOptions() {
    $options = [];

    foreach ($this->getEntityTypes() as $entity_type) {
      $bundles = $this->entityTypeBundleInfo->getBundleInfo($entity_type->id());
      foreach ($bundles as $bundle_name => $bundle_info) {
        $id = sprintf('%s.%s', $entity_type->id(), $bundle_name);
        $options[(string) $entity_type->getLabel()][$id] = $bundle_info['label'];
      }
    }

    return $options;
  }

}
