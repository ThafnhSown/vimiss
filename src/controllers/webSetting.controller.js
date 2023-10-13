import { successResponse } from "@/common/responses";
import webSettingService from "@/services/webSetting.service";
import { ParseQuery } from "@/utils/http";

export default {
  /** @type {import("express").RequestHandler} */
  async getMenuItems(req, res) {
    const type = ParseQuery.num(req.query.type);
    const locale = ParseQuery.str(req.query.locale);
    const data = await webSettingService.getWebMenu(type, locale);
    return successResponse(res, data)
  }
}