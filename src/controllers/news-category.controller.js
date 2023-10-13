import { BadRequestError, ForbiddenError } from "@/common/errors";
import { successResponse } from "@/common/responses";
import { PREFIX_API_CMS } from "@/routers/config";
import newsCategoryService from "@/services/news-category.service";
import SEOInfoService from "@/services/SEOInfo.service";
import { ParseQuery } from "@/utils/http";
import { CMSPermission } from "@/utils/permission";

export default {
  /**@type {import("express").RequestHandler} */
  async listCategories(req, res) {
    const baseUrl = req.baseUrl;
    const offset = ParseQuery.num(req.query.offset);
    const limit = ParseQuery.num(req.query.limit);
    const slug = ParseQuery.str(req.query.slug);
    const locale = ParseQuery.str(req.query.locale);
    const withPrivate = baseUrl === PREFIX_API_CMS ? true : ParseQuery.bool(req.query.withPrivate);
    const data = await newsCategoryService.listCategories({
      offset,
      limit,
      slug,
      locale,
      withPrivate
    })
    return successResponse(res, data)
  },

  /**@type {import("express").RequestHandler} */
  async retrieveCategory(req, res) {
    const id = req.params.id;
    const category = await newsCategoryService.getCategoryById({ id })
    return successResponse(res, category)
  },

  /**@type {AsyncAuthRequestHandler} */
  async createCategory(req, res) {
    if (!req.body.title) throw new BadRequestError()
    if (!CMSPermission.isNewsCategoryEditor(req.credential?.roles))
      throw new ForbiddenError()
    const data = await newsCategoryService.createCategory(req.body);
    return successResponse(res, data);
  },

  /** @type {AsyncAuthRequestHandler} */
  async partialUpdateCategory(req, res) {
    if (!CMSPermission.isNewsCategoryEditor(req.credential?.roles))
      throw new ForbiddenError()
    const id = req.params.id;
    const { seo, id: __id, _id, ...updates } = req.body;
    newsCategoryService.partialUpdateCategory({
      id,
      updates
    })
    if (seo) {
      SEOInfoService.partialUpdateSEOInfo({ ...seo })
    }
    return successResponse(res);
  },

  /** @type {AsyncAuthRequestHandler} */
  async deleteCategory(req, res) {
    if (!CMSPermission.isNewsCategoryEditor(req.credential?.roles))
      throw new ForbiddenError()
    const id = req.params.id;
    const force = ParseQuery.bool(req.query.force);
    await newsCategoryService.deleteCategory(id, force);
    return successResponse(res)
  } 
}