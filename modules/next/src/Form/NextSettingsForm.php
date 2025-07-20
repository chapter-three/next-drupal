<?php

namespace Drupal\next\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Form\SubformState;
use Drupal\next\Plugin\ConfigurablePreviewUrlGeneratorInterface;
use Drupal\next\Plugin\PreviewUrlGeneratorManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides the settings form for Next.
 */
class NextSettingsForm extends ConfigFormBase {

  /**
   * The preview url generator manager.
   *
   * @var \Drupal\next\Plugin\PreviewUrlGeneratorManagerInterface
   */
  protected PreviewUrlGeneratorManagerInterface $previewUrlGeneratorManager;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    $instance = parent::create($container);

    $instance->previewUrlGeneratorManager = $container->get('plugin.manager.next.preview_url_generator');

    return $instance;
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
      '#title' => $this->t('Draft Mode'),
      '#type' => 'details',
      '#group' => 'settings',
    ];

    $form['preview_url_generator_container']['preview_url_generator'] = [
      '#title' => $this->t('Plugin'),
      '#description' => $this->t('Select a plugin to use for the draft validation generator.'),
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

    if ($preview_url_generator_id = $form_state->getValue('preview_url_generator')) {
      $preview_url_generator = $this->previewUrlGeneratorManager->createInstance($preview_url_generator_id);
      if ($preview_url_generator instanceof ConfigurablePreviewUrlGeneratorInterface) {
        $subform_state = SubformState::createForSubform($form['preview_url_generator_container']['settings_container'], $form, $form_state);
        $preview_url_generator->submitConfigurationForm($form, $subform_state);
      }
    }

    $this->config('next.settings')
      ->set('preview_url_generator', $form_state->getValue('preview_url_generator'))
      ->set('preview_url_generator_configuration', $form_state->getValue('preview_url_generator_configuration'))
      ->set('debug', $form_state->getValue('debug'))
      ->save();
  }

}
