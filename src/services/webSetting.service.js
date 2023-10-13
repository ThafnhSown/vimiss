import { MenuItemModel } from "@/db/models/MenuItem"

export default {
  /**
   * 
   * @param {import("@gitlab-koolsoft-dev/vimiss-portal-config").MenuItemType} [type]
   * @param {import("@gitlab-koolsoft-dev/vimiss-portal-config/locale").Locale} [locale]
   * @returns {Promise<Array<import("@gitlab-koolsoft-dev/vimiss-portal-config").MenuItem>>}
   */
  async getWebMenu(type, locale) {
    const filter = { locale };
    if (typeof type !== "undefined") filter.type = type;
    const items = await MenuItemModel.find(filter).sort({ index: 1 });
    return items;
  }
}