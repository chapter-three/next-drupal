<?php

namespace Drupal\next\Form;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a form for switching sites in the Iframe preview.
 */
class IframeSitePreviewerSwitcherForm extends FormBase {

  /**
   * The route match.
   *
   * @var \Drupal\Core\Routing\RouteMatchInterface
   */
  protected $routeMatch;

  /**
   * IframeSitePreviewer constructor.
   *
   * @param \Drupal\Core\Routing\RouteMatchInterface $route_match
   *   The route match.
   */
  public function __construct(RouteMatchInterface $route_match) {
    $this->routeMatch = $route_match;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static($container->get('current_route_match'));
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'iframe_site_previewer';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, EntityInterface $entity = NULL, array $sites = [], string $site_id = NULL) {
    /** @var \Drupal\next\Entity\NextSiteInterface[] $sites */
    $site_options = [];
    foreach ($sites as $site) {
      $site_options[$site->id()] = $site->label();
    }

    $form['container'] = [
      '#type' => 'details',
      '#title' => $this->t('Switch site'),
      '#open' => TRUE,
      '#attributes' => ['class' => ['container-inline']],
    ];

    $form['container']['site'] = [
      '#title' => $this->t('Select a site'),
      '#type' => 'select',
      '#options' => $site_options,
      '#default_value' => $site_id,
      '#required' => TRUE,
      '#title_display' => 'invisible',
    ];

    $form['container']['actions'] = [
      '#type' => 'actions',
    ];

    $form['container']['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Submit'),
      '#button_type' => 'primary',
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $form_state->setRedirect($this->routeMatch->getRouteName(), $this->routeMatch->getRawParameters()->all(), [
      'query' => ['site' => trim($form_state->getValue('site'))],
    ]);
  }

}
