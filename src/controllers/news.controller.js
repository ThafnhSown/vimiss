import { BadRequestError, ForbiddenError } from "@/common/errors";
import { successResponse } from "@/common/responses";
import newsService from "@/services/news.service";
import SEOInfoService from "@/services/SEOInfo.service";
import { ParseQuery } from "@/utils/http";
import { CMSPermission } from "@/utils/permission";
import { PREFIX_API_CMS } from "@/routers/config";

export default {
  /**@type {import("express").RequestHandler} */
  async listNews(req, res) {
    const baseUrl = req.baseUrl;
    const offset = ParseQuery.num(req.query.offset);
    const limit = ParseQuery.num(req.query.limit);
    const slug = ParseQuery.str(req.query.slug);
    const locale = ParseQuery.str(req.query.locale);
    const search = ParseQuery.str(req.query.search);
    const categoryId = ParseQuery.str(req.query.categoryId);
    const withPrivate = baseUrl === PREFIX_API_CMS ? true : ParseQuery.bool(req.query.withPrivate);
    const data = await newsService.listNews({
      offset,
      limit,
      slug,
      locale,
      withPrivate,
      search,
      categoryId
    })
    return successResponse(res, data)
  },

  /**@type {import("express").RequestHandler} */
  async retrieveNews(req, res) {
    const id = req.params.id;
    const news = await newsService.getNewsById({ id })
    return successResponse(res, news)
  },

  /** @type {AsyncAuthRequestHandler} */
  async createNews(req, res) {
    if (!req.body.title) throw new BadRequestError()
    if (!CMSPermission.isNewsCategoryEditor(req.credential?.roles))
      throw new ForbiddenError()
    const data = await newsService.createNews(req.body);
    return successResponse(res, data);
  },

  /** @type {AsyncAuthRequestHandler} */
  async partialUpdateNews(req, res) {
    if (!CMSPermission.isNewsCategoryEditor(req.credential?.roles))
      throw new ForbiddenError()
    const id = req.params.id;
    const { seo, id: __id, _id, ...updates } = req.body;
    await newsService.partialUpdateNews({
      id,
      updates
    })
    if (seo) {
      await SEOInfoService.partialUpdateSEOInfo({ ...seo })
    }
    return successResponse(res);
  },

  /** @type {AsyncAuthRequestHandler} */
  async deleteNews(req, res) {
    if (!CMSPermission.isNewsCategoryEditor(req.credential?.roles))
      throw new ForbiddenError()
    const id = req.params.id;
    const force = ParseQuery.bool(req.query.force);
    await newsService.deleteNews(id, force);
    return successResponse(res)
  }
}