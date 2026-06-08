# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.1.0](https://github.com/Symmetrics-Lab/strapi-plugin-local-image-format/compare/v2.0.5...v2.1.0) (2026-06-08)


### Features

* `maxDimension` config option (default `4000`) that rejects oversized resize requests with `400` before sharp allocates the canvas, guarding against memory-exhaustion DoS

### Bug Fixes

* harden image middleware against DoS and fix conditional caching ([7e80c08](https://github.com/Symmetrics-Lab/strapi-plugin-local-image-format/commit/7e80c0880bd76625c5e28850f49f53736e06ac7b))
* pin `ohash` to `^1.1.6`: 2.x is ESM-only and broke Strapi's `require()`, so the plugin failed to load on a clean install
* emit a valid HTTP-date `Last-Modified` header instead of epoch milliseconds
* prefix-based mount-path matching (no mid-URL or sibling-path false matches)

### Security / Dependencies

* resolve dependency advisories on the published surface (`npm audit --omit=dev` 6 → 1); bump `qs`, add overrides for `svgo`/`node-forge`/`h3`
* stop committing lockfiles to scope Dependabot's dependency graph to declared manifests
* require Node `>=20` (modern Strapi relies on `Array.prototype.toSorted`)

## [2.0.0](https://github.com/Symmetrics-Lab/strapi-plugin-local-image-format/compare/v1.7.0...v2.0.0) (2025-02-11)


### Features

* update to use Strapi v5
* upgrade dependencies
* forked from strapi-plugin-local-image-sharp


All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.7.0](https://github.com/strapi-community/strapi-plugin-local-image-sharp/compare/v1.6.0...v1.7.0) (2023-07-31)


### Features

* allow to configure custom paths ([#29](https://github.com/strapi-community/strapi-plugin-local-image-sharp/issues/29)) ([0992821](https://github.com/strapi-community/strapi-plugin-local-image-sharp/commit/0992821469bed878534ed8b1c5058447f2a8151d))


### Bug Fixes

* docs ([#22](https://github.com/strapi-community/strapi-plugin-local-image-sharp/issues/22)) ([c1519a4](https://github.com/strapi-community/strapi-plugin-local-image-sharp/commit/c1519a4b316a8a2501ac0f3b60029ab5a9102d75))

## [1.6.0](https://github.com/strapi-community/strapi-plugin-local-image-sharp/compare/v1.4.0...v1.6.0) (2023-02-28)


### Features

* add `maxAge` option for Cache-Control HTTP response header ([#20](https://github.com/strapi-community/strapi-plugin-local-image-sharp/issues/20)) ([d81843b](https://github.com/strapi-community/strapi-plugin-local-image-sharp/commit/d81843bdeb4fd8611873c73c8b1275569a9980dd))

## [1.4.0](https://github.com/strapi-community/strapi-plugin-local-image-sharp/compare/v1.3.0...v1.4.0) (2023-01-06)


### Features

* add cacheDir option to save generated file ([3b52e0f](https://github.com/strapi-community/strapi-plugin-local-image-sharp/commit/3b52e0f3b8ebfb537690bf970c0a340ddd36aeaa))

## [1.3.0](https://github.com/strapi-community/strapi-plugin-local-image-sharp/compare/v1.2.1...v1.3.0) (2023-01-06)


### Features

* add avif to allowed types ([26b256f](https://github.com/strapi-community/strapi-plugin-local-image-sharp/commit/26b256f8d334bd14652d3120ed279ec190374d45))
* create documentation with vitepress ([dd9b374](https://github.com/strapi-community/strapi-plugin-local-image-sharp/commit/dd9b374d94258841796fcb67088c4403f0ff85eb))


### Bug Fixes

* broken path modifiers ([5e75ff6](https://github.com/strapi-community/strapi-plugin-local-image-sharp/commit/5e75ff6c3601cfb6685c5722b2a7022fc8f2cd66)), closes [#12](https://github.com/strapi-community/strapi-plugin-local-image-sharp/issues/12)

### [1.2.1](https://github.com/strapi-community/strapi-plugin-local-image-sharp/compare/v1.2.0...v1.2.1) (2022-10-12)
