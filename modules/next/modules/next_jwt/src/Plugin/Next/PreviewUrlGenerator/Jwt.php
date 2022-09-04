<?php

namespace Drupal\next_jwt\Plugin\Next\PreviewUrlGenerator;

use Drupal\Component\Datetime\TimeInterface;
use Drupal\Component\Serialization\Json;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\KeyValueStore\KeyValueExpirableFactoryInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\Core\Url;
use Drupal\jwt\Authentication\Provider\JwtAuth;
use Drupal\next\Annotation\PreviewUrlGenerator;
use Drupal\next\Entity\NextSiteInterface;
use Drupal\next\Exception\InvalidPreviewUrlRequest;
use Drupal\next\Plugin\ConfigurablePreviewUrlGeneratorBase;
use Drupal\next\PreviewSecretGeneratorInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * Provides the preview_url_generator plugin based on JWT.
 *
 * @PreviewUrlGenerator(
 *  id = "jwt",
 *  label = "JSON Web Tokens",
 *  description = "This plugin generates preview URL using JSON Web Tokens. You
 *   can use this for user-based access control."
 * )
 */
class Jwt extends ConfigurablePreviewUrlGeneratorBase {

  /**
   * The JWT Authentication provider.
   *
   * @var \Drupal\jwt\Authentication\Provider\JwtAuth
   */
  protected JwtAuth $jwtAuth;

  /**
   * The key value storage.
   *
   * @var \Drupal\Core\KeyValueStore\KeyValueExpirableFactoryInterface
   */
  protected KeyValueExpirableFactoryInterface $keyValue;

  /**
   * The user entity.
   *
   * @var \Drupal\Core\Entity\EntityInterface|null
   */
  protected ?EntityInterface $user;

  /**
   * Jwt constructor.
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
   * @param \Drupal\jwt\Authentication\Provider\JwtAuth $jwt_auth
   *   The JWT Authentication provider.
   * @param \Drupal\Core\KeyValueStore\KeyValueExpirableFactoryInterface $key_value
   *   The key value storage.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, AccountProxyInterface $current_user, TimeInterface $time, PreviewSecretGeneratorInterface $preview_secret_generator, EntityTypeManagerInterface $entity_type_manager, JwtAuth $jwt_auth, KeyValueExpirableFactoryInterface $key_value) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $current_user, $time, $preview_secret_generator, $entity_type_manager);
    $this->jwtAuth = $jwt_auth;
    $this->keyValue = $key_value;
    $this->user = $entity_type_manager->getStorage('user')
      ->load($current_user->id());
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static($configuration, $plugin_id, $plugin_definition, $container->get('current_user'), $container->get('datetime.time'), $container->get('next.preview_secret_generator'), $container->get('entity_type.manager'), $container->get('jwt.authentication.jwt'), $container->get('keyvalue.expirable'));
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'secret_expiration' => NULL,
      'access_token_expiration' => NULL,
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

    $form['access_token_expiration'] = [
      '#title' => $this->t('Access token expiration time'),
      '#description' => $this->t('The value, in seconds, to be used as expiration time for the access token.'),
      '#type' => 'number',
      '#required' => TRUE,
      '#default_value' => $this->configuration['access_token_expiration'],
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
    $this->configuration['secret_expiration'] = $form_state->getValue('secret_expiration');
    $this->configuration['access_token_expiration'] = $form_state->getValue('access_token_expiration');
  }

  /**
   * {@inheritdoc}
   */
  public function generate(NextSiteInterface $next_site, EntityInterface $entity, string $resource_version = NULL): ?Url {
    $query = [];
    $query['slug'] = $slug = $entity->toUrl()->toString();
    $query['uuid'] = $this->user->uuid();

    // Create a secret based on the timestamp, slug and the user uuid.
    $query['timestamp'] = $timestamp = $this->time->getRequestTime();
    $query['secret'] = $secret = $this->previewSecretGenerator->generate($timestamp . $slug . $resource_version . $this->user->uuid());

    // Generate a JWT and store it temporarily so that we can retrieve it on validate.
    $jwt = $this->jwtAuth->generateToken();
    $this->keyValue->get('next_jwt')
      ->setWithExpire($secret, $jwt, $this->configuration['access_token_expiration']);

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

    // Validate the uuid.
    if (empty($body['uuid'])) {
      throw new InvalidPreviewUrlRequest("Field 'uuid' is missing");
    }

    // Validate the timestamp.
    if (empty($body['timestamp'])) {
      throw new InvalidPreviewUrlRequest("Field 'timestamp' is missing");
    }

    $timestamp = (int) $body['timestamp'];
    if ($this->time->getRequestTime() > $timestamp + (int) $this->configuration['secret_expiration']) {
      throw new InvalidPreviewUrlRequest("The provided secret has expired.");
    }

    // Validate the secret.
    if (empty($body['secret'])) {
      throw new InvalidPreviewUrlRequest("Field 'secret' is missing");
    }

    if ($body['secret'] !== $this->previewSecretGenerator->generate($body['timestamp'] . $body['slug'] . $body['resourceVersion'] . $body['uuid'])) {
      throw new InvalidPreviewUrlRequest("The provided secret is invalid.");
    }

    // Retrieve the JWT from storage and send it.
    // Since key value expire automatically handles expiration, we don't need
    // to check for jwt expiration here.
    $jwt = $this->keyValue->get('next_jwt')->get($body['secret']);
    if (!$jwt) {
      throw new InvalidPreviewUrlRequest("The provided secret is invalid.");
    }

    return [
      'access_token' => $jwt,
    ];
  }

}
