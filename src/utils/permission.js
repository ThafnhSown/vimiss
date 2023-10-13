const { BuiltInRoles } = require("@gitlab-koolsoft-dev/vimiss-portal-config")

const CMSPermission = {
  /**
   * 
   * @param {Array<import("@gitlab-koolsoft-dev/vimiss-portal-config").CredentialRole>} args 
   */
  canLogin(args) {
    return args && args.some((r) => [
      BuiltInRoles.ROOT,
      BuiltInRoles.CMS_ADMIN
    ].includes(r.builtInRole))
  },
  /**
   * @param {Array<import("@gitlab-koolsoft-dev/vimiss-portal-config").CredentialRole>} args 
   */
  isNewsCategoryEditor(args) {
    return args && args.some((r) => [
      BuiltInRoles.ROOT,
      BuiltInRoles.CMS_ADMIN
    ].includes(r.builtInRole))
  }
}

export {
  CMSPermission
}