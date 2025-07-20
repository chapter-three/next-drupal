<?php

namespace Drupal\next\Form;

use Drupal\Core\Entity\EntityForm;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Form\SubformState;
use Drupal\next\Plugin\ConfigurableSitePreviewerInterface;
use Drupal\next\Plugin\SitePreviewerManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Base form for next_site.
 */
class NextSiteForm extends EntityForm {

  /**
   * The site previewer manager.
   *
   * @var \Drupal\next\Plugin\SitePreviewerManagerInterface
   */
  protected SitePreviewerManagerInterface $sitePreviewerManager;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    $instance = parent::create($container);
    $instance->sitePreviewerManager = $container->get('plugin.manager.next.site_previewer');
    return $instance;
  }

  /**
   * {@inheritdoc}
   */
  public function form(array $form, FormStateInterface $form_state) {
    $form = parent::form($form, $form_state);

    /** @var \Drupal\next\Entity\NextSiteInterface $entity */
    $entity = $this->entity;

    $form['label'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Label'),
      '#description' => $this->t('Example: Blog or Marketing site.'),
      '#maxlength' => 255,
      '#default_value' => $entity->label(),
      '#required' => TRUE,
    ];

    $form['id'] = [
      '#type' => 'machine_name',
      '#default_value' => $entity->id(),
      '#machine_name' => [
        'exists' => '\Drupal\next\Entity\NextSite::load',
      ],
      '#disabled' => !$entity->isNew(),
    ];

    $form['base_url'] = [
      '#type' => 'url',
      '#title' => $this->t('Base URL'),
      '#description' => $this->t('Enter the base URL for the Next.js site. Example: <em>https://example.com</em>.'),
      '#default_value' => $entity->getBaseUrl(),
      '#required' => TRUE,
    ];

    $form['settings'] = [
      '#type' => 'vertical_tabs',
      '#title' => $this->t('Settings'),
    ];

    $form['preview'] = [
      '#title' => $this->t('Draft Mode'),
      '#description' => $this->t('Draft mode (or the deprecated Preview mode) allows editors to preview content on the site. You can read more on the <a href=":uri" target="_blank">Next.js documentation</a>.', [
        ':uri' => 'https://nextjs.org/docs/app/building-your-application/configuring/draft-mode',
      ]),
      '#type' => 'details',
      '#group' => 'settings',
    ];

    $form['preview']['preview_url'] = [
      '#type' => 'url',
      '#title' => $this->t('Draft URL (or Preview URL)'),
      '#description' => $this->t('Enter the draft URL or preview URL. Example: <em>https://example.com/api/draft</em> or <em>https://example.com/api/preview</em>.'),
      '#default_value' => $entity->getPreviewUrl(),
    ];

    $form['preview']['preview_secret'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Secret key'),
      '#description' => $this->t('Enter a secret for the site draft/preview. This must be unique for each Next.js site'),
      '#default_value' => $entity->getPreviewSecret(),
    ];

    $form['revalidation'] = [
      '#title' => $this->t('On-demand Revalidation'),
      '#description' => $this->t('On-demand revalidation updates your pages when content is updated on your Drupal site. You can read more on the <a href=":uri" target="_blank">Next.js documentation</a>.', [
        ':uri' => 'https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#revalidating-data',
      ]),
      '#type' => 'details',
      '#group' => 'settings',
    ];

    $form['revalidation']['revalidate_url'] = [
      '#type' => 'url',
      '#title' => $this->t('Revalidate URL'),
      '#description' => $this->t('Enter the revalidate URL. Example: <em>https://example.com/api/revalidate</em>.'),
      '#default_value' => $entity->getRevalidateUrl(),
    ];

    $form['revalidation']['revalidate_secret'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Revalidate secret'),
      '#description' => $this->t('Enter a secret for the site revalidate. This is the same value used for <em>DRUPAL_REVALIDATE_SECRET</em>.'),
      '#default_value' => $entity->getRevalidateSecret(),
    ];

    $form['site_previewer_container'] = [
      '#title' => $this->t('Site Preview'),
      '#description' => $this->t('Configure how content preview works for this site.'),
      '#type' => 'details',
      '#group' => 'settings',
    ];

    $form['site_previewer_container']['site_previewer'] = [
      '#title' => $this->t('Plugin'),
      '#description' => $this->t('Select a plugin to use for the site preview.'),
      '#type' => 'select',
      '#options' => array_column($this->sitePreviewerManager->getDefinitions(), 'label', 'id'),
      '#default_value' => $entity->getSitePreviewer(),
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

    if (($site_previewer_id = $form_state->getValue('site_previewer')) || ($site_previewer_id = $entity->getSitePreviewer())) {
      $site_previewer = $this->sitePreviewerManager->createInstance($site_previewer_id, $entity->getSitePreviewerConfiguration());
      if ($site_previewer instanceof ConfigurableSitePreviewerInterface) {
        $form['site_previewer_configuration'] = [
          '#tree' => TRUE,
        ];
        $subform_state = SubformState::createForSubform($form['site_previewer_configuration'], $form, $form_state);
        $form['site_previewer_container']['settings_container']['site_previewer_configuration'] = $site_previewer->buildConfigurationForm($form['site_previewer_configuration'], $subform_state);
      }
    }

    return $form;
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
    return $form['site_previewer_container']['settings_container'];
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
  public function save(array $form, FormStateInterface $form_state) {
    /** @var \Drupal\next\Entity\NextSiteInterface $next_site */
    $next_site = $this->entity;

    // Handle site previewer configuration.
    if ($site_previewer_id = $form_state->getValue('site_previewer')) {
      $next_site->setSitePreviewer($site_previewer_id);
      
      $site_previewer = $this->sitePreviewerManager->createInstance($site_previewer_id);
      if ($site_previewer instanceof ConfigurableSitePreviewerInterface) {
        $subform_state = SubformState::createForSubform($form['site_previewer_configuration'], $form, $form_state);
        $site_previewer->submitConfigurationForm($form, $subform_state);
        $next_site->setSitePreviewerConfiguration($form_state->getValue('site_previewer_configuration') ?: []);
      }
    }

    $status = $next_site->save();

    $this->messenger()->addStatus($this->t('Next.js site %label has been %action.', [
      '%label' => $next_site->label(),
      '%action' => $status === SAVED_NEW ? 'added' : 'updated',
    ]));

    $form_state->setRedirectUrl($next_site->toUrl('collection'));
  }

}
