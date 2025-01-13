[**next-drupal**](../README.md)

---

[next-drupal](../globals.md) / FetchOptions

# Interface: FetchOptions

Defined in: [packages/next-drupal/src/types/options.ts:9](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/types/options.ts#L9)

## Extends

- `RequestInit`

## Properties

### body?

> `optional` **body**: `BodyInit`

Defined in: node_modules/typescript/lib/lib.dom.d.ts:1673

A BodyInit object or null to set request's body.

#### Inherited from

`RequestInit.body`

---

### cache?

> `optional` **cache**: `RequestCache`

Defined in: node_modules/typescript/lib/lib.dom.d.ts:1675

A string indicating how the request will interact with the browser's cache to set request's cache.

#### Inherited from

`RequestInit.cache`

---

### credentials?

> `optional` **credentials**: `RequestCredentials`

Defined in: node_modules/typescript/lib/lib.dom.d.ts:1677

A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials.

#### Inherited from

`RequestInit.credentials`

---

### headers?

> `optional` **headers**: `HeadersInit`

Defined in: node_modules/typescript/lib/lib.dom.d.ts:1679

A Headers object, an object literal, or an array of two-item arrays to set request's headers.

#### Inherited from

`RequestInit.headers`

---

### integrity?

> `optional` **integrity**: `string`

Defined in: node_modules/typescript/lib/lib.dom.d.ts:1681

A cryptographic hash of the resource to be fetched by request. Sets request's integrity.

#### Inherited from

`RequestInit.integrity`

---

### keepalive?

> `optional` **keepalive**: `boolean`

Defined in: node_modules/typescript/lib/lib.dom.d.ts:1683

A boolean to set request's keepalive.

#### Inherited from

`RequestInit.keepalive`

---

### method?

> `optional` **method**: `string`

Defined in: node_modules/typescript/lib/lib.dom.d.ts:1685

A string to set request's method.

#### Inherited from

`RequestInit.method`

---

### mode?

> `optional` **mode**: `RequestMode`

Defined in: node_modules/typescript/lib/lib.dom.d.ts:1687

A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode.

#### Inherited from

`RequestInit.mode`

---

### next?

> `optional` **next**: `NextFetchRequestConfig`

Defined in: node_modules/next/types/global.d.ts:59

#### Inherited from

`RequestInit.next`

---

### priority?

> `optional` **priority**: `RequestPriority`

Defined in: node_modules/typescript/lib/lib.dom.d.ts:1688

#### Inherited from

`RequestInit.priority`

---

### redirect?

> `optional` **redirect**: `RequestRedirect`

Defined in: node_modules/typescript/lib/lib.dom.d.ts:1690

A string indicating whether request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion). Sets request's redirect.

#### Inherited from

`RequestInit.redirect`

---

### referrer?

> `optional` **referrer**: `string`

Defined in: node_modules/typescript/lib/lib.dom.d.ts:1692

A string whose value is a same-origin URL, "about:client", or the empty string, to set request's referrer.

#### Inherited from

`RequestInit.referrer`

---

### referrerPolicy?

> `optional` **referrerPolicy**: `ReferrerPolicy`

Defined in: node_modules/typescript/lib/lib.dom.d.ts:1694

A referrer policy to set request's referrerPolicy.

#### Inherited from

`RequestInit.referrerPolicy`

---

### signal?

> `optional` **signal**: `AbortSignal`

Defined in: node_modules/typescript/lib/lib.dom.d.ts:1696

An AbortSignal to set request's signal.

#### Inherited from

`RequestInit.signal`

---

### window?

> `optional` **window**: `null`

Defined in: node_modules/typescript/lib/lib.dom.d.ts:1698

Can only be null. Used to disassociate request from any Window.

#### Inherited from

`RequestInit.window`

---

### withAuth?

> `optional` **withAuth**: `boolean` \| [`NextDrupalAuth`](../type-aliases/NextDrupalAuth.md)

Defined in: [packages/next-drupal/src/types/options.ts:10](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/types/options.ts#L10)
