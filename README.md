# Vimiss Portal Server

## @gitlab-koolsoft-dev/vimiss-portal-config Installation Guide

- Add `.npmrc` at the root of project
- Add `@gitlab-koolsoft-dev` registry data to `.npmrc` file:

  ```npmrc
  @gitlab-koolsoft-dev:registry=https://gitlab.com/api/v4/projects/48399418/packages/npm/
  //gitlab.com/api/v4/projects/48399418/packages/npm/:_authToken=<gitlab-npm-token>
  ```

- Using `npm` or `yarn` to install the package

  ```bash
  npm install @gitlab-koolsoft-dev/vimiss-portal-config
  # or
  yarn add @gitlab-koolsoft-dev/vimiss-portal-config
  ```