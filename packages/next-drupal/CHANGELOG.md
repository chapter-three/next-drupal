# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.4.0-rc.0](https://github.com/chapter-three/next-drupal/compare/next-drupal@1.4.0-alpha.0...next-drupal@1.4.0-rc.0) (2022-06-06)


### Bug Fixes

* **next-drupal:** update response type for client.getView ([13bbac2](https://github.com/chapter-three/next-drupal/commit/13bbac26097f3e24f0f90b9f25560bfe7ce946b3))





# [1.4.0-alpha.0](https://github.com/chapter-three/next-drupal/compare/next-drupal@1.3.2...next-drupal@1.4.0-alpha.0) (2022-06-02)


### Bug Fixes

* **next-drupal:** update handling for string errors ([a4d3d38](https://github.com/chapter-three/next-drupal/commit/a4d3d3806637b17868e8d21fe1f383636a9c47d1))
* **next-drupal:** update message handling in jsonapi-errors ([f9a281a](https://github.com/chapter-three/next-drupal/commit/f9a281ab51d4abcf865672fd3a9ed07c6f7feb3a))
* **next-drupal:** update missing opts from access token ([b166ef0](https://github.com/chapter-three/next-drupal/commit/b166ef09d2c8201a3a5f6d771eb23f6f330c7916))
* **next-drupal:** update translatePath handling ([fa3e864](https://github.com/chapter-three/next-drupal/commit/fa3e864fda741e22c9aeb2a0167a4a0cbcfeb733))


### Features

* **next-drupal:** add createResource, updateResource and deleteResource helpers ([5200824](https://github.com/chapter-three/next-drupal/commit/52008242ca7199991f88824614ffacef0b2faf77))
* **next-drupal:** allow auth to accept an access token ([d7fade0](https://github.com/chapter-three/next-drupal/commit/d7fade049cdbaaf13b7af0fab91b86460577e286))
* **next-drupal:** allow client to accept username and password for auth ([cff5ded](https://github.com/chapter-three/next-drupal/commit/cff5ded1da270db85a278e0e04f81a6551351620))
* **next-drupal:** createResource, updateResource and deleteResource are auth'd by default ([205fb12](https://github.com/chapter-three/next-drupal/commit/205fb122065740da5a123777a55120959a21f9ad))
* **next-drupal:** introduce throwJsonApiErrors option ([#196](https://github.com/chapter-three/next-drupal/issues/196)) ([18690e1](https://github.com/chapter-three/next-drupal/commit/18690e10a829104068693b93fa84e5987d59de21))
* **next-drupal:** rename createMediaFileResource to createFileResource ([e4901e4](https://github.com/chapter-three/next-drupal/commit/e4901e4e0fa5d32d45032a8f0ec166d0d1253222))
* **next-drupal:** update error handling ([c0ddc9c](https://github.com/chapter-three/next-drupal/commit/c0ddc9c6dd5a18f07e7981311df347367ff593d2))





## [1.3.2](https://github.com/chapter-three/next-drupal/compare/next-drupal@1.3.1...next-drupal@1.3.2) (2022-05-02)


### Bug Fixes

* **next-drupal:** skip subrequests if path is passed to getResourceFromContext ([ca65e62](https://github.com/chapter-three/next-drupal/commit/ca65e62118c733b7bd857ae3ab395b3dc4fbbbe8))





## [1.3.1](https://github.com/chapter-three/next-drupal/compare/next-drupal@1.3.0...next-drupal@1.3.1) (2022-04-25)


### Bug Fixes

* **next-drupal:** backport slug encoding fix to helpers ([29ee9d3](https://github.com/chapter-three/next-drupal/commit/29ee9d3818aef4ebc925b37231693944f751d998))
* **next-drupal:** encode slug parts in getPathFromContext ([b56dd9e](https://github.com/chapter-three/next-drupal/commit/b56dd9eae04398c93f21282789547372c695df0a))





# [1.3.0](https://github.com/chapter-three/next-drupal/compare/next-drupal@1.22...next-drupal@1.3.0) (2022-04-19)

### Features

* **next-drupal:** add `Experimental_DrupalClient` (https://next-drupal.org/docs/client)




## [1.2.2](https://github.com/chapter-three/next-drupal/compare/next-drupal@1.2.1...next-drupal@1.2.2) (2022-04-11)


### Bug Fixes

* **next-drupal:** unnecessary optional chaining ([3335d94](https://github.com/chapter-three/next-drupal/commit/3335d947b8090bb0b8719f6a385f5a8c2f7a951e))
* **next-drupal:** use a generic for getMenu and useMenu ([8e2cdc2](https://github.com/chapter-three/next-drupal/commit/8e2cdc244c20710f46db94a1f257157f7d285601))





## [1.2.1](https://github.com/chapter-three/next-drupal/compare/next-drupal@1.2.0...next-drupal@1.2.1) (2022-03-28)


### Bug Fixes

* **next-drupal:** handle cases where menu might be empty ([76c9fd6](https://github.com/chapter-three/next-drupal/commit/76c9fd693492c86210db41cfbee1537800f4419f))





# [1.2.0](https://github.com/chapter-three/next-drupal/compare/next-drupal@1.1.1...next-drupal@1.2.0) (2022-02-24)


### Features

* **next-drupal:** add UNSTABLE_DRUPAL_ACCESS_TOKEN ([325e368](https://github.com/chapter-three/next-drupal/commit/325e368534720c8350afdf381f12b982f9a5d196))





## [1.1.1](https://github.com/chapter-three/next-drupal/compare/next-drupal@1.1.0...next-drupal@1.1.1) (2022-01-17)


### Bug Fixes

* **next-drupal:** add return type for translatePathFromContext ([25265f1](https://github.com/chapter-three/next-drupal/commit/25265f1d4101a677eb5b73d18a801545adb0494e))
* **next-drupal:** update peerDependencies ([6223e7b](https://github.com/chapter-three/next-drupal/commit/6223e7b16fa4960c707fbbf0ce593d849e706b48))





# [1.1.0](https://github.com/chapter-three/next-drupal/compare/next-drupal@1.0.1...next-drupal@1.1.0) (2022-01-12)


### Bug Fixes

* **next-drupal:** use auth call for JSON:API index call with locale ([eac97fb](https://github.com/chapter-three/next-drupal/commit/eac97fb3d5caeb83ea4f5057b1391438cd292c6e))


### Features

* **next-drupal:** add translatePath and translatePathFromContext helpers ([10e3995](https://github.com/chapter-three/next-drupal/commit/10e3995ea3832521f109c7959890b76ca4fff34d))
* **next-drupal:** do not use access token for json:api index ([25f0eef](https://github.com/chapter-three/next-drupal/commit/25f0eef66275d586df9bab5b7c5dd4e30c850592))





## [1.0.1](https://github.com/chapter-three/next-drupal/compare/next-drupal@1.0.0...next-drupal@1.0.1) (2021-12-21)


### Bug Fixes

* **next-drupal:** handle nested params in getResourceByPath ([36e756b](https://github.com/chapter-three/next-drupal/commit/36e756b069c654b9197fb1b818f2ef61f937bff1))
* **www:** meta tags ([f68ed91](https://github.com/chapter-three/next-drupal/commit/f68ed912100c5a2aedf8c0a2df894c6f58afcd5c))





# [1.0.0](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.18.0...next-drupal@1.0.0) (2021-12-03)

**Note:** Version bump only for package next-drupal





# [0.18.0](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.17.0...next-drupal@0.18.0) (2021-11-24)


### Features

* **next-drupal:** add support for jsonapi search api ([efb3526](https://github.com/chapter-three/next-drupal/commit/efb3526c1ee20fa98a9f05c0893a6be7dfdfa921))





# [0.17.0](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.17.0-alpha.0...next-drupal@0.17.0) (2021-11-01)


### Features

* update next version ([d1b1fad](https://github.com/chapter-three/next-drupal/commit/d1b1fadf31171b188fe0afb50078333d78a548a0))





# [0.17.0-alpha.0](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.16.2...next-drupal@0.17.0-alpha.0) (2021-11-01)


### Bug Fixes

* **drupal-site:** upgrade to Drupal 9 ([bc59377](https://github.com/chapter-three/next-drupal/commit/bc593771779d59947ad764d56e35c5fcb82af616))


### Features

* **next-drupal:** cache access_token ([395f53d](https://github.com/chapter-three/next-drupal/commit/395f53dea4ef401bffe872038ee43457d2862385))





## [0.16.2](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.16.1...next-drupal@0.16.2) (2021-10-14)


### Bug Fixes

* **next-drupal:** handle nested params ([651d697](https://github.com/chapter-three/next-drupal/commit/651d6976f88d3f4097df1c41648412837262df4a))





## [0.16.1](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.16.0...next-drupal@0.16.1) (2021-10-14)


### Bug Fixes

* **next-drupal:** add types for collection ([d88d61c](https://github.com/chapter-three/next-drupal/commit/d88d61c6fec731971c8ba6f130f6283aae6aec2a))





# [0.16.0](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.15.0...next-drupal@0.16.0) (2021-10-13)


### Bug Fixes

* **next-drupal:** update types for resource collection ([242688d](https://github.com/chapter-three/next-drupal/commit/242688db74de09066ea76be28428f9716631463a))
* rename repo links ([48d52dd](https://github.com/chapter-three/next-drupal/commit/48d52dde79f69396ef706d152c03670117b6a480))


### Features

* add support for non-revisionable entity types ([b221694](https://github.com/chapter-three/next-drupal/commit/b2216944172f031dd779d8bb4e848a98853be006))
* **next-drupal:** improve types ([9cb8076](https://github.com/chapter-three/next-drupal/commit/9cb8076472f3309cee6aa73d179df70ee60e2693))
* remove drupal-jsonapi-params dependency ([8e7a13f](https://github.com/chapter-three/next-drupal/commit/8e7a13f24a6ada0a5aec81706a1627829a77b39d))





# [0.15.0](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.14.0...next-drupal@0.15.0) (2021-08-11)


### Bug Fixes

* **next-drupal:** add check for undefined vars ([a9c7d17](https://github.com/chapter-three/next-drupal/commit/a9c7d170ab72f4c9b2b187c7236bcd1d317da24d))


### Features

* **next-drupal:** implement syncDrupalPreviewRoutes util ([b7faf40](https://github.com/chapter-three/next-drupal/commit/b7faf405e2f28bc279d1110afcddb44074689746))





# [0.14.0](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.13.0...next-drupal@0.14.0) (2021-08-07)


### Features

* **next-drupal:** make access token configurable ([e732578](https://github.com/chapter-three/next-drupal/commit/e732578940e6da14da069dc67794a935cd9daa19))





# [0.13.0](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.12.0...next-drupal@0.13.0) (2021-06-22)


### Bug Fixes

* **next-drupal:** handle cases where previewData is not properly set ([cf2d4d1](https://github.com/chapter-three/next-drupal/commit/cf2d4d106b8a170e150e040a7496bb1f08caa64f))
* **next-drupal:** typo ([abcd28e](https://github.com/chapter-three/next-drupal/commit/abcd28ece952335d4d72352ef3b05b5207b6ca55))


### Features

* **next-drupal:** handle locale info in preview ([ed00703](https://github.com/chapter-three/next-drupal/commit/ed00703a8ccf382b073993eab1a4f2c0f741effa))





# [0.12.0](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.11.1...next-drupal@0.12.0) (2021-06-16)


### Features

* update to nextjs 11 ([1e46e44](https://github.com/chapter-three/next-drupal/commit/1e46e44ab5eb9d961e95dcc87d51282178f02bb2))





## [0.11.1](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.11.0...next-drupal@0.11.1) (2021-06-16)


### Bug Fixes

* **next-drupal:** return view page links and count ([4236043](https://github.com/chapter-three/next-drupal/commit/42360434ac29ef857580ebfb423269c9705ebf04))





# [0.11.0](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.10.0...next-drupal@0.11.0) (2021-06-15)


### Features

* **next-drupal:** add support for jsonapi_views ([4195ee7](https://github.com/chapter-three/next-drupal/commit/4195ee7687b41f8a88de19d7aa5ccd200d11abb7))





# [0.10.0](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.9.2...next-drupal@0.10.0) (2021-06-14)


### Bug Fixes

* **next-drupal:** update handling of locale ([56364ce](https://github.com/chapter-three/next-drupal/commit/56364ce6f3f2aaef2d0d48a8fe544c1c03fba418))
* **next-drupal:** update useMenu ([9463bd1](https://github.com/chapter-three/next-drupal/commit/9463bd174b71172eebaa98c91475b64245f16934))


### Features

* **next-drupal:** add locale dependency to useMenu ([d9bb031](https://github.com/chapter-three/next-drupal/commit/d9bb03136884b5a2ac109ccbef77a3984fc21247))





## [0.9.2](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.9.1...next-drupal@0.9.2) (2021-06-13)


### Bug Fixes

* update locale support for translated path ([4fad345](https://github.com/chapter-three/next-drupal/commit/4fad3457e8e8d6205122c29783c2aff67aa4fbe6))





## [0.9.1](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.9.0...next-drupal@0.9.1) (2021-06-13)


### Bug Fixes

* **next-drupal:** let site handle published status ([c1fc90a](https://github.com/chapter-three/next-drupal/commit/c1fc90a5c3e7fea7e3b1e2d06504f67669dbc57e))





# [0.9.0](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.8.0...next-drupal@0.9.0) (2021-06-13)


### Features

* **next-drupal:** add getResource and preview handlers ([b32410f](https://github.com/chapter-three/next-drupal/commit/b32410fce47567a22210eca61987bb635cacaeb5))





# [0.8.0](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.7.0...next-drupal@0.8.0) (2021-06-11)


### Bug Fixes

* remove console ([56a4c3e](https://github.com/chapter-three/next-drupal/commit/56a4c3eb5b95b90cb5a513653c05a09abbf3a213))


### Features

* update all sites ([ca9b2e9](https://github.com/chapter-three/next-drupal/commit/ca9b2e964c5a7fe591602465f2c2516eb4a54a1b))





# [0.7.0](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.6.0...next-drupal@0.7.0) (2021-06-10)


### Features

* **next-drupal:** add menu support ([95b4a84](https://github.com/chapter-three/next-drupal/commit/95b4a8422bc092ca60b75e8c85504d2919834df5))





# [0.6.0](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.5.0...next-drupal@0.6.0) (2021-05-17)


### Features

* add getEntityByPath ([072ead7](https://github.com/chapter-three/next-drupal/commit/072ead7ecc3b7f158e4b81e03d17f0bf1a5b511c))





# [0.5.0](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.4.1...next-drupal@0.5.0) (2021-05-17)


### Features

* deserialize entities by default ([8b53ae2](https://github.com/chapter-three/next-drupal/commit/8b53ae222717b8983568194373be04903944a032))





## [0.4.1](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.4.0...next-drupal@0.4.1) (2021-05-07)

**Note:** Version bump only for package next-drupal





# [0.4.0](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.3.0...next-drupal@0.4.0) (2021-05-07)


### Features

* allow sites with no access_token ([50cc84a](https://github.com/chapter-three/next-drupal/commit/50cc84a73ca694691ad93d020f40fe86ffdf8798))





# [0.3.0](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.2.1...next-drupal@0.3.0) (2021-04-29)


### Features

* add next_jsonapi module and switch to subrequests ([23b1367](https://github.com/chapter-three/next-drupal/commit/23b136775f7c0f5ee5f386e322affc7fc8adae4f))





## [0.2.1](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.2.0...next-drupal@0.2.1) (2021-02-02)

**Note:** Version bump only for package next-drupal





# [0.2.0](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.1.1...next-drupal@0.2.0) (2021-02-01)


### Features

* implement filter by entity reference ([eeade94](https://github.com/chapter-three/next-drupal/commit/eeade9485caaff587735d5d8211a86a88ca8847f))





## [0.1.1](https://github.com/chapter-three/next-drupal/compare/next-drupal@0.1.0...next-drupal@0.1.1) (2021-02-01)


### Bug Fixes

* update example sites ([33143d0](https://github.com/chapter-three/next-drupal/commit/33143d0d5229be6424c41ace2ad846c0d85447d9))





# 0.1.0 (2021-01-31)


### Bug Fixes

* return null if no body passed ([327fb7e](https://github.com/chapter-three/next-drupal/commit/327fb7ea0996eb5ecefa416630d11c9597c5f4be))


### Features

* add example-blog ([1c24eb3](https://github.com/chapter-three/next-drupal/commit/1c24eb3588696fe35e2a9aa2ac20f9547b901c7c))
* add marketing site ([8462d7c](https://github.com/chapter-three/next-drupal/commit/8462d7cfcf623a9e8ca03456ebed0bb6ab838e11))
