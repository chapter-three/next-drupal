import type {
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
    token_type: "Bearer",
    expires_in: 3600,
  } as DrupalClientAuthAccessToken,
  clientIdSecret: {
    clientId: "7795065e-8ad0-45eb-a64d-73d9f3a5e943",
    clientSecret: "d92Fm^ds",
  } as DrupalClientAuthClientIdSecret,
  callback: function authFunction() {
    return "custom Authentication header from authFunction"
  },
  customAuthenticationHeader: "custom Authentication header from string",
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
  node: {
    ok: {
      jsonapi: {
        meta: {
          links: {
            self: {
              href: "http://jsonapi.org/format/1.0/",
            },
          },
        },
        version: "1.0",
      },
      data: {
        type: "node--recipe",
        id: "71e04ead-4cc7-416c-b9ca-60b635fdc50f",
        attributes: {
          changed: "2022-03-25T08:02:17+00:00",
          content_translation_outdated: false,
          content_translation_source: "und",
          created: "2022-03-21T10:52:42+00:00",
          default_langcode: true,
          drupal_internal__nid: 1,
          drupal_internal__vid: 37,
          field_cooking_time: 30,
          field_difficulty: "medium",
          field_ingredients: [
            "For the pastry:",
            "280g plain flour",
            "140g butter",
            "Cold water",
            "For the filling:",
            "1 onion",
            "2 garlic cloves",
            "Half a courgette",
            "450ml soya milk",
            "500g grated parmesan",
            "2 eggs",
            "200g sun dried tomatoes",
            "100g feta",
          ],
          field_number_of_servings: 8,
          field_preparation_time: 40,
          field_recipe_instruction: {
            format: "basic_html",
            processed:
              "<ol><li>Preheat the oven to 400°F/200°C. Starting with the pastry; rub the flour and butter together in a bowl until crumbling like breadcrumbs. Add water, a little at a time, until it forms a dough.</li>\n" +
              "<li>Roll out the pastry on a floured board and gently spread over your tin. Place in the fridge for 20 minutes before blind baking for a further 10.</li>\n" +
              "<li>Whilst the pastry is cooling, chop and gently cook the onions, garlic and courgette.</li>\n" +
              "<li>In a large bowl, add the soya milk, half the parmesan, and the eggs. Gently mix.</li>\n" +
              "<li>Once the pastry is cooked, spread the onions, garlic and sun dried tomatoes over the base and pour the eggs mix over. Sprinkle the remaining parmesan and careful lay the feta over the top. Bake for 30 minutes or until golden brown.</li>\n" +
              "</ol>",
            value:
              "<ol>\n" +
              "\t<li>Preheat the oven to 400°F/200°C. Starting with the pastry; rub the flour and butter together in a bowl until crumbling like breadcrumbs. Add water, a little at a time, until it forms a dough.</li>\n" +
              "\t<li>Roll out the pastry on a floured board and gently spread over your tin. Place in the fridge for 20 minutes before blind baking for a further 10.</li>\n" +
              "\t<li>Whilst the pastry is cooling, chop and gently cook the onions, garlic and courgette.</li>\n" +
              "\t<li>In a large bowl, add the soya milk, half the parmesan, and the eggs. Gently mix.</li>\n" +
              "\t<li>Once the pastry is cooked, spread the onions, garlic and sun dried tomatoes over the base and pour the eggs mix over. Sprinkle the remaining parmesan and careful lay the feta over the top. Bake for 30 minutes or until golden brown.</li>\n" +
              "</ol>",
          },
          field_summary: {
            format: "basic_html",
            processed:
              "<p>An Italian inspired quiche with sun dried tomatoes and courgette. A perfect light meal for a summer's day.</p>",
            value:
              "<p>An Italian inspired quiche with sun dried tomatoes and courgette. A perfect light meal for a summer's day.</p>",
          },
          langcode: "en",
          moderation_state: "published",
          path: {
            alias: "/recipes/deep-mediterranean-quiche",
            langcode: "en",
            pid: 67,
          },
          promote: true,
          revision_log: null,
          revision_timestamp: "2022-03-25T08:02:17+00:00",
          revision_translation_affected: true,
          status: true,
          sticky: false,
          title: "Deep mediterranean quiche - edited",
        },
        relationships: {
          field_media_image: {
            data: {
              id: "bbfe9d97-2da2-432b-a22c-0396c08e06ca",
              meta: {
                drupal_internal__target_id: 1,
              },
              type: "media--image",
            },
            links: {
              related: {
                href: "https://example.com/en/jsonapi/node/recipe/71e04ead-4cc7-416c-b9ca-60b635fdc50f/field_media_image?resourceVersion=id%3A37",
              },
              self: {
                href: "https://example.com/en/jsonapi/node/recipe/71e04ead-4cc7-416c-b9ca-60b635fdc50f/relationships/field_media_image?resourceVersion=id%3A37",
              },
            },
          },
          field_recipe_category: {
            data: [
              {
                id: "a6c02fe4-67bf-462c-90cb-32281a07efe4",
                meta: {
                  drupal_internal__target_id: 31,
                },
                type: "taxonomy_term--recipe_category",
              },
            ],
            links: {
              related: {
                href: "https://example.com/en/jsonapi/node/recipe/71e04ead-4cc7-416c-b9ca-60b635fdc50f/field_recipe_category?resourceVersion=id%3A37",
              },
              self: {
                href: "https://example.com/en/jsonapi/node/recipe/71e04ead-4cc7-416c-b9ca-60b635fdc50f/relationships/field_recipe_category?resourceVersion=id%3A37",
              },
            },
          },
          field_tags: {
            data: [
              {
                id: "46258827-cfad-4813-99dc-287c4cb41117",
                meta: {
                  drupal_internal__target_id: 22,
                },
                type: "taxonomy_term--tags",
              },
              {
                id: "f32a4d84-0568-4bfd-8be3-8217d36efb6d",
                meta: {
                  drupal_internal__target_id: 13,
                },
                type: "taxonomy_term--tags",
              },
            ],
            links: {
              related: {
                href: "https://example.com/en/jsonapi/node/recipe/71e04ead-4cc7-416c-b9ca-60b635fdc50f/field_tags?resourceVersion=id%3A37",
              },
              self: {
                href: "https://example.com/en/jsonapi/node/recipe/71e04ead-4cc7-416c-b9ca-60b635fdc50f/relationships/field_tags?resourceVersion=id%3A37",
              },
            },
          },
          node_type: {
            data: {
              id: "9b70a287-cade-454f-be8b-dea7b9a37c7a",
              meta: {
                drupal_internal__target_id: "recipe",
              },
              type: "node_type--node_type",
            },
            links: {
              related: {
                href: "https://example.com/en/jsonapi/node/recipe/71e04ead-4cc7-416c-b9ca-60b635fdc50f/node_type?resourceVersion=id%3A37",
              },
              self: {
                href: "https://example.com/en/jsonapi/node/recipe/71e04ead-4cc7-416c-b9ca-60b635fdc50f/relationships/node_type?resourceVersion=id%3A37",
              },
            },
          },
          revision_uid: {
            data: {
              id: "365cc7b5-ddc4-4b3b-939e-1494400aab4a",
              meta: {
                drupal_internal__target_id: 1,
              },
              type: "user--user",
            },
            links: {
              related: {
                href: "https://example.com/en/jsonapi/node/recipe/71e04ead-4cc7-416c-b9ca-60b635fdc50f/revision_uid?resourceVersion=id%3A37",
              },
              self: {
                href: "https://example.com/en/jsonapi/node/recipe/71e04ead-4cc7-416c-b9ca-60b635fdc50f/relationships/revision_uid?resourceVersion=id%3A37",
              },
            },
          },
          uid: {
            data: {
              id: "9e4944e8-dd77-407a-8610-83e823b48b56",
              meta: {
                drupal_internal__target_id: 4,
              },
              type: "user--user",
            },
            links: {
              related: {
                href: "https://example.com/en/jsonapi/node/recipe/71e04ead-4cc7-416c-b9ca-60b635fdc50f/uid?resourceVersion=id%3A37",
              },
              self: {
                href: "https://example.com/en/jsonapi/node/recipe/71e04ead-4cc7-416c-b9ca-60b635fdc50f/relationships/uid?resourceVersion=id%3A37",
              },
            },
          },
        },
        links: {
          self: {
            href: "https://example.com/en/jsonapi/node/recipe/71e04ead-4cc7-416c-b9ca-60b635fdc50f?resourceVersion=id%3A37",
          },
        },
      },
      links: {
        self: {
          href: "https://example.com/en/jsonapi/node/recipe/71e04ead-4cc7-416c-b9ca-60b635fdc50f",
        },
      },
    },
    forbidden: {
      jsonapi: {
        version: "1.0",
        meta: { links: { self: { href: "http://jsonapi.org/format/1.0/" } } },
      },
      errors: [
        {
          title: "Forbidden",
          status: "403",
          detail:
            "The current user is not allowed to GET the selected resource. The user does not have access to the requested version.",
          source: { pointer: "/data" },
        },
      ],
    },
  },
  translatePath: {
    ok: {
      jsonapi: {
        basePath: "/en/jsonapi",
        entryPoint: "https://example.com/en/jsonapi",
        individual:
          "https://example.com/en/jsonapi/node/recipe/71e04ead-4cc7-416c-b9ca-60b635fdc50f",
        resourceName: "node--recipe",
      },
      entity: {
        bundle: "recipe",
        canonical: "https://example.com/en/recipes/deep-mediterranean-quiche",
        id: "1",
        langcode: "en",
        path: "/en/recipes/deep-mediterranean-quiche",
        type: "node",
        uuid: "71e04ead-4cc7-416c-b9ca-60b635fdc50f",
      },
      isHomePath: false,
      label: "Deep mediterranean quiche - edited",
      resolved: "https://example.com/en/recipes/deep-mediterranean-quiche",
    },
    notFound: {
      message: "Unable to resolve path /path-does-not-exist.",
      details:
        "None of the available methods were able to find a match for this path.",
    },
  },
  subRequests: {
    ok: {
      router: {
        body: "SEE REPLACEMENT BELOW",
        headers: {
          "cache-control": ["no-cache, private"],
          "content-id": ["<router>"],
          "content-type": ["application/json"],
          date: ["Fri, 12 Apr 2024 16:44:53 GMT"],
          status: [200],
          "x-drupal-dynamic-cache": ["HIT"],
        },
      },
      "resolvedResource#uri{0}": {
        body: "SEE REPLACEMENT BELOW",
        headers: {
          "cache-control": ["no-cache, private"],
          "content-id": ["<resolvedResource#uri{0}>"],
          "content-type": ["application/vnd.api+json"],
          date: ["Fri, 12 Apr 2024 16:44:54 GMT"],
          status: [200],
          "x-drupal-dynamic-cache": ["HIT"],
        },
      },
    },
    forbidden: {
      router: {
        body: "SEE REPLACEMENT BELOW",
        headers: {
          "cache-control": ["no-cache, private"],
          "content-id": ["<router>"],
          "content-type": ["application/json"],
          date: ["Fri, 12 Apr 2024 16:44:53 GMT"],
          status: [200],
          "x-drupal-dynamic-cache": ["HIT"],
        },
      },
      "resolvedResource#uri{0}": {
        body: "SEE REPLACEMENT BELOW",
        headers: {
          "cache-control": ["no-cache, private"],
          "content-id": ["<resolvedResource#uri{0}>"],
          "content-type": ["application/vnd.api+json"],
          date: ["Fri, 12 Apr 2024 16:44:54 GMT"],
          status: [403],
          "x-drupal-dynamic-cache": ["MISS"],
        },
      },
    },
    pathNotFound: {
      router: {
        body: "SEE REPLACEMENT BELOW",
        headers: {
          "cache-control": ["no-cache, private"],
          "content-id": ["<router>"],
          "content-type": ["application/json"],
          date: ["Fri, 12 Apr 2024 16:44:54 GMT"],
          status: [404],
          "x-drupal-dynamic-cache": ["MISS"],
        },
      },
    },
  },
}
// JSON-encode the subrequest body fields.
resources.subRequests.ok.router.body = JSON.stringify(
  resources.translatePath.ok
)
resources.subRequests.ok["resolvedResource#uri{0}"].body = JSON.stringify(
  resources.node.ok
)
resources.subRequests.forbidden.router.body = JSON.stringify(
  resources.translatePath.ok
)
resources.subRequests.forbidden["resolvedResource#uri{0}"].body =
  JSON.stringify(resources.node.forbidden)
resources.subRequests.pathNotFound.router.body = JSON.stringify(
  resources.translatePath.notFound
)

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
      {
        type: "menu_link_content--menu_link_content",
        id: "menu_link_content:c116329b-dd21-445d-ab44-9f89f940339c",
        attributes: {
          description: null,
          enabled: true,
          expanded: false,
          menu_name: "main",
          meta: {
            entity_id: "1",
          },
          options: [],
          parent: "",
          provider: "menu_link_content",
          route: {
            name: "entity.node.canonical",
            parameters: {
              node: "1",
            },
          },
          title: "About",
          url: "/en/about",
          weight: 40,
        },
      },
      {
        type: "menu_link_content--menu_link_content",
        id: "menu_link_content:87d2132d-a55c-4743-aebc-87c050c58ba3",
        attributes: {
          description: null,
          enabled: true,
          expanded: false,
          menu_name: "main",
          meta: {
            entity_id: "3",
          },
          options: [],
          parent: "menu_link_content:c116329b-dd21-445d-ab44-9f89f940339c",
          provider: "menu_link_content",
          route: {
            name: "entity.node.canonical",
            parameters: {
              node: "2",
            },
          },
          title: "Locations",
          url: "/en/about/locations",
          weight: -10,
        },
      },
      {
        type: "menu_link_content--menu_link_content",
        id: "menu_link_content:7b1de73b-2497-4634-854c-6ef6142b790b",
        attributes: {
          description: null,
          enabled: true,
          expanded: false,
          menu_name: "main",
          meta: {
            entity_id: "2",
          },
          options: [],
          parent: "menu_link_content:c116329b-dd21-445d-ab44-9f89f940339c",
          provider: "menu_link_content",
          route: {
            name: "entity.node.canonical",
            parameters: {
              node: "3",
            },
          },
          title: "Team",
          url: "/en/about/team",
          weight: 0,
        },
      },
      {
        type: "menu_link_content--menu_link_content",
        id: "menu_link_content:80b574f3-5271-4769-93c5-8ae406864b0c",
        attributes: {
          description: null,
          enabled: true,
          expanded: false,
          menu_name: "main",
          meta: {
            entity_id: "4",
          },
          options: [],
          parent: "menu_link_content:7b1de73b-2497-4634-854c-6ef6142b790b",
          provider: "menu_link_content",
          route: {
            name: "entity.node.canonical",
            parameters: {
              node: "4",
            },
          },
          title: "Management",
          url: "/en/about/team/management",
          weight: 0,
        },
      },
    ],
    links: {
      self: {
        href: "https://example.com/jsonapi/menu_items/main",
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
            href: "https://example.com/jsonapi/menu_items/INVALID",
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
