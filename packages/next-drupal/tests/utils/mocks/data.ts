import type {
  DrupalClientAuth,
  DrupalClientAuthAccessToken,
  DrupalClientAuthClientIdSecret,
  DrupalClientAuthUsernamePassword,
} from "../../../src"

// Run all tests against this env until we configure CI to setup a Drupal instance.
// TODO: Bootstrap and expose the /drupal env for testing.
export const BASE_URL = process.env["DRUPAL_BASE_URL"] as string

const auth = {
  basicAuth: {
    username: "admin",
    password: "example",
  } as DrupalClientAuthUsernamePassword,
  accessToken: {
    access_token: "ECYM594IlARGc3S8KgBHvTpki0rDtWx6",
    token_type: "bearer",
    expires_in: 3600,
  } as DrupalClientAuthAccessToken,
  clientIdSecret: {
    clientId: "7795065e-8ad0-45eb-a64d-73d9f3a5e943",
    clientSecret: "d92Fm^ds",
  } as DrupalClientAuthClientIdSecret,
  function: function authFunction() {
    return "custom Authentication header from authFunction"
  } as DrupalClientAuth,
  customAuthenticationHeader:
    "custom Authentication header from string" as DrupalClientAuth,
}

const resources = {
  file: {
    jsonapi: {
      version: "1.0",
      meta: { links: { self: { href: "http://jsonapi.org/format/1.0/" } } },
    },
    data: {
      type: "file--file",
      id: "641fc6a4-276d-43e9-abbd-1e51bc28ddf9",
      links: {
        self: {
          href: "https://example.com/en/jsonapi/file/file/641fc6a4-276d-43e9-abbd-1e51bc28ddf9",
        },
      },
      attributes: {
        drupal_internal__fid: 1,
        langcode: "en",
        filename: "mediterranean-quiche-umami.jpg",
        uri: {
          value: "public://mediterranean-quiche-umami.jpg",
          url: "/sites/default/files/mediterranean-quiche-umami.jpg",
        },
        filemime: "image/jpeg",
        filesize: 70160,
        status: true,
        created: "2022-03-21T10:52:42+00:00",
        changed: "2022-03-21T10:52:42+00:00",
      },
      relationships: {
        uid: {
          data: null,
          links: {
            related: {
              href: "https://example.com/en/jsonapi/file/file/641fc6a4-276d-43e9-abbd-1e51bc28ddf9/uid",
            },
            self: {
              href: "https://example.com/en/jsonapi/file/file/641fc6a4-276d-43e9-abbd-1e51bc28ddf9/relationships/uid",
            },
          },
        },
      },
    },
    links: {
      self: {
        href: "https://example.com/en/jsonapi/file/file/641fc6a4-276d-43e9-abbd-1e51bc28ddf9",
      },
    },
  },
  mediaImage: {
    jsonapi: {
      version: "1.0",
      meta: { links: { self: { href: "http://jsonapi.org/format/1.0/" } } },
    },
    data: {
      type: "media--image",
      id: "bbfe9d97-2da2-432b-a22c-0396c08e06ca",
      links: {
        self: {
          href: "https://example.com/en/jsonapi/media/image/bbfe9d97-2da2-432b-a22c-0396c08e06ca?resourceVersion=id%3A1",
        },
      },
      attributes: {
        drupal_internal__mid: 1,
        drupal_internal__vid: 1,
        langcode: "en",
        revision_created: "2022-03-21T10:52:42+00:00",
        revision_log_message: null,
        status: true,
        name: "Deep mediterranean quiche",
        created: "2022-03-21T10:52:42+00:00",
        changed: "2022-03-21T10:52:42+00:00",
        default_langcode: true,
        revision_translation_affected: true,
        path: { alias: null, pid: null, langcode: "en" },
        content_translation_source: "und",
        content_translation_outdated: false,
      },
      relationships: {
        bundle: {
          data: {
            type: "media_type--media_type",
            id: "afec21c2-d0a9-4e0e-8c3a-1cd6d5a8fc92",
            meta: { drupal_internal__target_id: "image" },
          },
          links: {
            related: {
              href: "https://example.com/en/jsonapi/media/image/bbfe9d97-2da2-432b-a22c-0396c08e06ca/bundle?resourceVersion=id%3A1",
            },
            self: {
              href: "https://example.com/en/jsonapi/media/image/bbfe9d97-2da2-432b-a22c-0396c08e06ca/relationships/bundle?resourceVersion=id%3A1",
            },
          },
        },
        revision_user: {
          data: null,
          links: {
            related: {
              href: "https://example.com/en/jsonapi/media/image/bbfe9d97-2da2-432b-a22c-0396c08e06ca/revision_user?resourceVersion=id%3A1",
            },
            self: {
              href: "https://example.com/en/jsonapi/media/image/bbfe9d97-2da2-432b-a22c-0396c08e06ca/relationships/revision_user?resourceVersion=id%3A1",
            },
          },
        },
        uid: {
          data: {
            type: "user--user",
            id: "256a133b-0bd7-4426-a823-b8ce81e0d778",
            meta: { drupal_internal__target_id: 0 },
          },
          links: {
            related: {
              href: "https://example.com/en/jsonapi/media/image/bbfe9d97-2da2-432b-a22c-0396c08e06ca/uid?resourceVersion=id%3A1",
            },
            self: {
              href: "https://example.com/en/jsonapi/media/image/bbfe9d97-2da2-432b-a22c-0396c08e06ca/relationships/uid?resourceVersion=id%3A1",
            },
          },
        },
        thumbnail: {
          data: {
            type: "file--file",
            id: "641fc6a4-276d-43e9-abbd-1e51bc28ddf9",
            meta: {
              alt: "A delicious deep layered Mediterranean quiche with basil garnish",
              title: null,
              width: 768,
              height: 511,
              drupal_internal__target_id: 1,
            },
          },
          links: {
            related: {
              href: "https://example.com/en/jsonapi/media/image/bbfe9d97-2da2-432b-a22c-0396c08e06ca/thumbnail?resourceVersion=id%3A1",
            },
            self: {
              href: "https://example.com/en/jsonapi/media/image/bbfe9d97-2da2-432b-a22c-0396c08e06ca/relationships/thumbnail?resourceVersion=id%3A1",
            },
          },
        },
        field_media_image: {
          data: {
            type: "file--file",
            id: "641fc6a4-276d-43e9-abbd-1e51bc28ddf9",
            meta: {
              alt: "A delicious deep layered Mediterranean quiche with basil garnish",
              title: null,
              width: 768,
              height: 511,
              drupal_internal__target_id: 1,
            },
          },
          links: {
            related: {
              href: "https://example.com/en/jsonapi/media/image/bbfe9d97-2da2-432b-a22c-0396c08e06ca/field_media_image?resourceVersion=id%3A1",
            },
            self: {
              href: "https://example.com/en/jsonapi/media/image/bbfe9d97-2da2-432b-a22c-0396c08e06ca/relationships/field_media_image?resourceVersion=id%3A1",
            },
          },
        },
      },
    },
    included: [
      {
        type: "file--file",
        id: "641fc6a4-276d-43e9-abbd-1e51bc28ddf9",
        links: {
          self: {
            href: "https://example.com/en/jsonapi/file/file/641fc6a4-276d-43e9-abbd-1e51bc28ddf9",
          },
        },
        attributes: {
          drupal_internal__fid: 1,
          langcode: "en",
          filename: "mediterranean-quiche-umami.jpg",
          uri: {
            value: "public://mediterranean-quiche-umami.jpg",
            url: "/sites/default/files/mediterranean-quiche-umami.jpg",
          },
          filemime: "image/jpeg",
          filesize: 70160,
          status: true,
          created: "2022-03-21T10:52:42+00:00",
          changed: "2022-03-21T10:52:42+00:00",
        },
        relationships: {
          uid: {
            data: null,
            links: {
              related: {
                href: "https://example.com/en/jsonapi/file/file/641fc6a4-276d-43e9-abbd-1e51bc28ddf9/uid",
              },
              self: {
                href: "https://example.com/en/jsonapi/file/file/641fc6a4-276d-43e9-abbd-1e51bc28ddf9/relationships/uid",
              },
            },
          },
        },
      },
    ],
    links: {
      self: {
        href: "https://example.com/en/jsonapi/media/image/bbfe9d97-2da2-432b-a22c-0396c08e06ca?include=field_media_image\u0026resourceVersion=id%3A1",
      },
    },
  },
}

const menus = {
  menuItems: {
    jsonapi: {
      version: "1.0",
      meta: {
        links: {
          self: {
            href: "http://jsonapi.org/format/1.0/",
          },
        },
      },
    },
    data: [
      {
        type: "menu_link_content--menu_link_content",
        id: "standard.front_page",
        attributes: {
          description: "",
          enabled: true,
          expanded: false,
          menu_name: "main",
          meta: [],
          options: [],
          parent: "",
          provider: "demo_umami",
          route: {
            name: "<front>",
            parameters: [],
          },
          title: "Home",
          url: "/en",
          weight: "0",
        },
      },
      {
        type: "menu_link_content--menu_link_content",
        id: "views_view:views.featured_articles.page_1",
        attributes: {
          description: "",
          enabled: true,
          expanded: false,
          menu_name: "main",
          meta: {
            view_id: "featured_articles",
            display_id: "page_1",
          },
          options: [],
          parent: "",
          provider: "views",
          route: {
            name: "view.featured_articles.page_1",
            parameters: [],
          },
          title: "Articles",
          url: "/en/articles",
          weight: "20",
        },
      },
      {
        type: "menu_link_content--menu_link_content",
        id: "views_view:views.recipes.page_1",
        attributes: {
          description: "",
          enabled: true,
          expanded: false,
          menu_name: "main",
          meta: {
            view_id: "recipes",
            display_id: "page_1",
          },
          options: [],
          parent: "",
          provider: "views",
          route: {
            name: "view.recipes.page_1",
            parameters: [],
          },
          title: "Recipes",
          url: "/en/recipes",
          weight: "30",
        },
      },
    ],
    links: {
      self: {
        href: "https://next-drupal-test.ddev.site/jsonapi/menu_items/main",
      },
    },
  },
  invalidMenu: {
    jsonapi: {
      version: "1.0",
      meta: {
        links: {
          self: {
            href: "http://jsonapi.org/format/1.0/",
          },
        },
      },
    },
    errors: [
      {
        title: "Not Found",
        status: "404",
        detail:
          'The "menu" parameter was not converted for the path "/jsonapi/menu_items/{menu}" (route name: "jsonapi_menu_items.menu")',
        links: {
          via: {
            href: "https://next-drupal-test.ddev.site/jsonapi/menu_items/INVALID",
          },
          info: {
            href: "http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.5",
          },
        },
      },
    ],
  },
}

export const mocks = {
  auth,
  resources,
  menus,
}
