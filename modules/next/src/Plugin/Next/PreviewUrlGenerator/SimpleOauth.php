<?php

namespace Drupal\next\Plugin\Next\PreviewUrlGenerator;

use Drupal\Component\Datetime\TimeInterface;
use Drupal\Component\Serialization\Json;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Messenger\MessengerInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\Core\Url;
use Drupal\next\Annotation\PreviewUrlGenerator;
use Drupal\next\Entity\NextSiteInterface;
use Drupal\next\Exception\InvalidPreviewUrlRequest;
use Drupal\next\Plugin\ConfigurablePreviewUrlGeneratorBase;
use Drupal\next\PreviewSecretGeneratorInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * Provides the preview_url_generator plugin based on simple_oauth.
 *
 * @PreviewUrlGenerator(
 *  id = "simple_oauth",
 *  label = "Simple OAuth",
 *  description = "This plugin generates token for role-based access control.
 *   Access control is handle using OAuth scopes."
 * )
 */
class SimpleOauth extends ConfigurablePreviewUrlGeneratorBase {

  /**
   * The module handler service.
   *
   * @var \Drupal\Core\Extension\ModuleHandlerInterface
   */
  protected ModuleHandlerInterface $moduleHandler;

  /**
   * SimpleOauth constructor.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin ID for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Session\AccountProxyInterface $current_user
   *   The current user.
   * @param \Drupal\Component\Datetime\TimeInterface $time
   *   The time service.
   * @param \Drupal\next\PreviewSecretGeneratorInterface $preview_secret_generator
   *   The preview secret generator.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   The module handler service.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, AccountProxyInterface $current_user, TimeInterface $time, PreviewSecretGeneratorInterface $preview_secret_generator, EntityTypeManagerInterface $entity_type_manager, ModuleHandlerInterface $module_handler) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $current_user, $time, $preview_secret_generator, $entity_type_manager);
    $this->moduleHandler = $module_handler;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static($configuration, $plugin_id, $plugin_definition, $container->get('current_user'), $container->get('datetime.time'), $container->get('next.preview_secret_generator'), $container->get('entity_type.manager'), $container->get('module_handler'));
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'secret_expiration' => NULL,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    $form['secret_expiration'] = [
      '#title' => $this->t('Preview secret expiration time'),
      '#description' => $this->t('The value, in seconds, to be used as expiration time for the preview secret. <strong>It is recommended to use short-lived secrets for increased security.</strong>'),
      '#type' => 'number',
      '#required' => TRUE,
      '#default_value' => $this->configuration['secret_expiration'],
    ];

    if ($this->moduleHandler->moduleExists('jwt')) {
      $form['jwt_error'] = [
        '#weight' => -100,
        '#theme' => 'status_messages',
        '#message_list' => [
          MessengerInterface::TYPE_ERROR => [
            $this->t('The JSON Web Tokens module is not compatible with the Simple OAuth module. You should uninstall it when using the Simple OAuth plugin.'),
          ],
        ],
      ];
    }

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
    $this->configuration['secret_expiration'] = $form_state->getValue('secret_expiration');
  }

  /**
   * {@inheritdoc}
   */
  public function generate(NextSiteInterface $next_site, EntityInterface $entity, string $resource_version = NULL): ?Url {
    $query = [];
    $query['slug'] = $slug = $entity->toUrl()->toString();

    // Send the current user roles as scope.
    $scopes = $this->getScopesForCurrentUser();

    if (!count($scopes)) {
      return NULL;
    }

    $query['scope'] = $scope = implode(' ', $scopes);

    // Create a secret based on the timestamp, slug, scope and resource version.
    $query['timestamp'] = $timestamp = $this->time->getRequestTime();
    $query['secret'] = $this->previewSecretGenerator->generate($timestamp . $slug . $scope . $resource_version);

    return Url::fromUri($next_site->getPreviewUrl(), [
      'query' => $query,
    ]);
  }

  /**
   * {@inheritdoc}
   */
  public function validate(Request $request) {
    $body = Json::decode($request->getContent());

    // Validate the slug.
    // We do not check for existing slug. We let the next.js site handle this.
    if (empty($body['slug'])) {
      throw new InvalidPreviewUrlRequest("Field 'slug' is missing");
    }

    // Validate the timestamp.
    if (empty($body['timestamp'])) {
      throw new InvalidPreviewUrlRequest("Field 'timestamp' is missing");
    }

    $timestamp = (int) $body['timestamp'];
    if ($this->time->getRequestTime() > $timestamp + (int) $this->configuration['secret_expiration']) {
      throw new InvalidPreviewUrlRequest("The provided secret has expired.");
    }

    if (empty($body['scope'])) {
      throw new InvalidPreviewUrlRequest("Field 'scope' is missing");
    }

    // Validate the secret.
    if (empty($body['secret'])) {
      throw new InvalidPreviewUrlRequest("Field 'secret' is missing");
    }

    if ($body['secret'] !== $this->previewSecretGenerator->generate($body['timestamp'] . $body['slug'] . $body['scope'] . $body['resourceVersion'])) {
      throw new InvalidPreviewUrlRequest("The provided secret is invalid.");
    }

    return [
      'scope' => $body['scope'],
    ];
  }

  /**
   * Returns scope for the current user.
   *
   * @return array|mixed
   *   An array of roles as scopes.
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   */
  protected function getScopesForCurrentUser(): array {
    $roles = $this->currentUser->getRoles(TRUE);
    $admin_role = $this->getAdminRole();

    // Return the admin role for administrators.
    if ((int) $this->currentUser->id() === 1 || in_array($admin_role, $roles)) {
      return [$admin_role];
    }

    return $roles;
  }

  /**
   * Returns an array of admin roles.
   *
   * @return string|null
   *   The admin role.
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   */
  protected function getAdminRole(): ?string {
    $admin_roles = $this->entityTypeManager->getStorage('user_role')
      ->getQuery()
      ->accessCheck(FALSE)
      ->condition('is_admin', TRUE)
      ->execute();

    if (!$admin_roles) {
      return NULL;
    }

    return reset($admin_roles);
  }

}
