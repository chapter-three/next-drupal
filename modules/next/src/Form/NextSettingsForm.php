<?php

namespace Drupal\next\Form;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Form\SubformState;
use Drupal\next\Plugin\ConfigurableSitePreviewerInterface;
use Drupal\next\Plugin\ConfigurablePreviewUrlGeneratorInterface;
use Drupal\next\Plugin\SitePreviewerManagerInterface;
use Drupal\next\Plugin\PreviewUrlGeneratorManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides the settings form for Next.
 */
class NextSettingsForm extends ConfigFormBase {

  /**
   * The site previewer manager.
   *
   * @var \Drupal\next\Plugin\SitePreviewerManagerInterface
   */
  protected $sitePreviewerManager;

  /**
   * The preview url generator manager.
   *
   * @var \Drupal\next\Plugin\PreviewUrlGeneratorManagerInterface
   */
  protected PreviewUrlGeneratorManagerInterface $previewUrlGeneratorManager;

  /**
   * NextSettingsForm constructor.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The config factory service.
   * @param \Drupal\next\Plugin\SitePreviewerManagerInterface $site_previewer_manager
   *   The site previewer manager.
   * @param \Drupal\next\Plugin\PreviewUrlGeneratorManagerInterface $preview_url_generator_manager
   *   The preview url generator manager.
   */
  public function __construct(ConfigFactoryInterface $config_factory, SitePreviewerManagerInterface $site_previewer_manager, PreviewUrlGeneratorManagerInterface $preview_url_generator_manager = NULL) {
    if (!$preview_url_generator_manager) {
      @trigger_error('Calling NextSettingsForm::__construct() without the $preview_url_generator_manager argument is deprecated in next:1.3.0. The $preview_url_generator_manager argument will be required in next:2.0.0. See https://www.drupal.org/project/next/releases/1.3.0', E_USER_DEPRECATED);
      $preview_url_generator_manager = \Drupal::service('plugin.manager.next.preview_url_generator');
    }

    parent::__construct($config_factory);
    $this->sitePreviewerManager = $site_previewer_manager;
    $this->previewUrlGeneratorManager = $preview_url_generator_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static($container->get('config.factory'), $container->get('plugin.manager.next.site_previewer'), $container->get('plugin.manager.next.preview_url_generator'));
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['next.settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'next_settings';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('next.settings');

    $form['settings'] = [
      '#type' => 'vertical_tabs',
      '#title' => $this->t('Settings'),
    ];

    $form['preview_url_generator_container'] = [
      '#title' => $this->t('Preview URL'),
      '#type' => 'details',
      '#group' => 'settings',
    ];

    $form['preview_url_generator_container']['preview_url_generator'] = [
      '#title' => $this->t('Plugin'),
      '#description' => $this->t('Select a plugin to use for the preview URL generator.'),
      '#type' => 'select',
      '#options' => array_column($this->previewUrlGeneratorManager->getDefinitions(), 'label', 'id'),
      '#default_value' => $config->get('preview_url_generator'),
      '#required' => TRUE,
      '#limit_validation_errors' => [['preview_url_generator']],
      '#submit' => ['::submitPreviewUrlGenerator'],
      '#executes_submit_callback' => TRUE,
      '#ajax' => [
        'callback' => '::ajaxReplacePreviewUrlGeneratorSettingsForm',
        'wrapper' => 'preview-url-generator-settings',
        'method' => 'replace',
      ],
    ];

    $form['preview_url_generator_container']['settings_container'] = [
      '#type' => 'container',
      '#prefix' => '<div id="preview-url-generator-settings">',
      '#suffix' => '</div>',
    ];

    if (($preview_url_generator_id = $form_state->getValue('preview_url_generator')) || ($preview_url_generator_id = $config->get('preview_url_generator'))) {
      $preview_url_generator = $this->previewUrlGeneratorManager->createInstance($preview_url_generator_id, $config->get('preview_url_generator_configuration') ?: []);
      if ($preview_url_generator instanceof ConfigurablePreviewUrlGeneratorInterface) {
        $subform_state = SubformState::createForSubform($form['preview_url_generator_container']['settings_container'], $form, $form_state);
        $form['preview_url_generator_container']['settings_container']['preview_url_generator_configuration'] = $preview_url_generator->buildConfigurationForm($form['preview_url_generator_container']['settings_container'], $subform_state);
        $form['preview_url_generator_container']['settings_container']['preview_url_generator_configuration']['#tree'] = TRUE;
      }
    }

    $form['site_previewer_container'] = [
      '#title' => $this->t('Site previewer'),
      '#type' => 'details',
      '#group' => 'settings',
    ];

    $form['site_previewer_container']['site_previewer'] = [
      '#title' => $this->t('Plugin'),
      '#description' => $this->t('Select a plugin to use for the site preview.'),
      '#type' => 'select',
      '#options' => array_column($this->sitePreviewerManager->getDefinitions(), 'label', 'id'),
      '#default_value' => $config->get('site_previewer'),
      '#required' => TRUE,
      '#limit_validation_errors' => [['site_previewer']],
      '#submit' => ['::submitSitePreviewer'],
      '#executes_submit_callback' => TRUE,
      '#ajax' => [
        'callback' => '::ajaxReplaceSitePreviewerSettingsForm',
        'wrapper' => 'site-previewer-settings',
        'method' => 'replace',
      ],
    ];

    $form['site_previewer_container']['settings_container'] = [
      '#type' => 'container',
      '#prefix' => '<div id="site-previewer-settings">',
      '#suffix' => '</div>',
    ];

    if (($site_previewer_id = $form_state->getValue('site_previewer')) || ($site_previewer_id = $config->get('site_previewer'))) {
      $site_previewer = $this->sitePreviewerManager->createInstance($site_previewer_id, $config->get('site_previewer_configuration'));
      if ($site_previewer instanceof ConfigurableSitePreviewerInterface) {
        $form['site_previewer_configuration'] = [
          '#tree' => TRUE,
        ];
        $subform_state = SubformState::createForSubform($form['site_previewer_configuration'], $form, $form_state);
        $form['site_previewer_container']['settings_container']['site_previewer_configuration'] = $site_previewer->buildConfigurationForm($form['site_previewer_configuration'], $subform_state);
      }
    }

    $form['development'] = [
      '#title' => $this->t('Development'),
      '#type' => 'details',
      '#group' => 'settings',
    ];

    $form['development']['debug'] = [
      '#title' => $this->t('Enable debug mode'),
      '#description' => $this->t('Logs additional information during development.'),
      '#type' => 'checkbox',
      '#default_value' => $config->get('debug'),
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * Handles submit call when site_previewer is selected.
   */
  public function submitSitePreviewer(array $form, FormStateInterface $form_state) {
    $form_state->setRebuild();
  }

  /**
   * Handles switching the site_previewer selector.
   */
  public function ajaxReplaceSitePreviewerSettingsForm($form, FormStateInterface $form_state) {
    return $form['site_previewer_settings_container'];
  }

  /**
   * Handles submit call when preview_url_generator is selected.
   */
  public function submitPreviewUrlGenerator(array $form, FormStateInterface $form_state) {
    $form_state->setRebuild();
  }

  /**
   * Handles switching the preview_url_generator selector.
   */
  public function ajaxReplacePreviewUrlGeneratorSettingsForm($form, FormStateInterface $form_state) {
    return $form['preview_url_generator_container']['settings_container'];
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    parent::validateForm($form, $form_state);

    if ($site_previewer_id = $form_state->getValue('site_previewer')) {
      $site_previewer = $this->sitePreviewerManager->createInstance($site_previewer_id);
      if ($site_previewer instanceof ConfigurableSitePreviewerInterface) {
        $subform_state = SubformState::createForSubform($form['site_previewer_configuration'], $form, $form_state);
        $site_previewer->validateConfigurationForm($form, $subform_state);
      }
    }

    if ($preview_url_generator_id = $form_state->getValue('preview_url_generator')) {
      $preview_url_generator = $this->previewUrlGeneratorManager->createInstance($preview_url_generator_id);
      if ($preview_url_generator instanceof ConfigurablePreviewUrlGeneratorInterface && isset($form['preview_url_generator_container']['settings_container'])) {
        $subform_state = SubformState::createForSubform($form['preview_url_generator_container']['settings_container'], $form, $form_state);
        $preview_url_generator->validateConfigurationForm($form, $subform_state);
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);

    if ($site_previewer_id = $form_state->getValue('site_previewer')) {
      $site_previewer = $this->sitePreviewerManager->createInstance($site_previewer_id);
      if ($site_previewer instanceof ConfigurableSitePreviewerInterface) {
        $subform_state = SubformState::createForSubform($form['site_previewer_configuration'], $form, $form_state);
        $site_previewer->submitConfigurationForm($form, $subform_state);
      }
    }

    if ($preview_url_generator_id = $form_state->getValue('preview_url_generator')) {
      $preview_url_generator = $this->previewUrlGeneratorManager->createInstance($preview_url_generator_id);
      if ($preview_url_generator instanceof ConfigurablePreviewUrlGeneratorInterface) {
        $subform_state = SubformState::createForSubform($form['preview_url_generator_container']['settings_container'], $form, $form_state);
        $preview_url_generator->submitConfigurationForm($form, $subform_state);
      }
    }

    $this->config('next.settings')
      ->set('site_previewer', $form_state->getValue('site_previewer'))
      ->set('site_previewer_configuration', $form_state->getValue('site_previewer_configuration'))
      ->set('preview_url_generator', $form_state->getValue('preview_url_generator'))
      ->set('preview_url_generator_configuration', $form_state->getValue('preview_url_generator_configuration'))
      ->set('debug', $form_state->getValue('debug'))
      ->save();
  }

}
