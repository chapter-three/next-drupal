<?php

namespace Drupal\next\Form;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Form\SubformState;
use Drupal\next\Plugin\ConfigurableSitePreviewerInterface;
use Drupal\next\Plugin\SitePreviewerManagerInterface;
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
   * NextSettingsForm constructor.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The config factory service.
   * @param \Drupal\next\Plugin\SitePreviewerManagerInterface $site_previewer_manager
   *   The site previewer manager.
   */
  public function __construct(ConfigFactoryInterface $config_factory, SitePreviewerManagerInterface $site_previewer_manager) {
    parent::__construct($config_factory);
    $this->sitePreviewerManager = $site_previewer_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
      $container->get('plugin.manager.next.site_previewer')
    );
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

    $form['site_previewer_container'] = [
      '#title' => $this->t('Site previewer'),
      '#type' => 'fieldset',
    ];

    $form['site_previewer_container']['site_previewer'] = [
      '#title' => $this->t('Site previewer'),
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

    $this->config('next.settings')
      ->set('site_previewer', $form_state->getValue('site_previewer'))
      ->set('site_previewer_configuration', $form_state->getValue('site_previewer_configuration'))
      ->save();
  }

}
