import { NewsModel } from "@/db/models/News";
import { NewsInCategoryModel } from "@/db/models/NewsInCategory";
import { SEOInfoModel } from "@/db/models/SEOInfoModel";
import { isValidObjectId, runTransaction } from "@/utils/mongo";
import { News, SEOInfo, slugify } from "@gitlab-koolsoft-dev/vimiss-portal-config";
import { STATUS_DELETED, STATUS_PRIVATE, STATUS_PUBLIC } from "@gitlab-koolsoft-dev/vimiss-portal-config/contraint";
import { SEORefType } from "@gitlab-koolsoft-dev/vimiss-portal-config/models/SEOInfo";
import mongoose from "mongoose";

export default {
  /**
   * @param {{
   *  offset?: number;
   *  limit?: number;
   *  withPrivate?: boolean;
   *  slug?: string;
   *  locale?: string;
   *  search?: string;
   *  categoryId?: string;
   * }} args 
   */
  async listNews(args) {
    const {
      offset = 0,
      limit = 10,
      withPrivate,
      slug,
      locale,
      search,
      categoryId
    } = args;

    if (!limit) return { total: 0, data: [] }
    /** @type {import("mongoose").FilterQuery<News>} */
    const filter = { status: withPrivate ? { $in: [STATUS_PUBLIC, STATUS_PRIVATE] } : { $in: [STATUS_PUBLIC] } }
    if (!!slug) filter.slug = slug;
    if (!!locale) filter.locale = locale;
    if (!!search) filter.$text = { $search: slugify(search, ' ', ' ') }

    let totalQuery = NewsModel
      .aggregate()
      .match(filter)

    let dataQuery = NewsModel
      .aggregate()
      .match(filter)

    /** @type {import("mongoose").PipelineStage.Lookup["$lookup"]} */
    const lookupCategoryOptions = {
      from: NewsInCategoryModel.collection.name,
      let: { newsId: "$_id" },
      pipeline: [
        {
          $match: {
            $and: [
              { $expr: { $eq: ["$$newsId", "$newsId"] } },
              { $expr: { $eq: ["$categoryId", new mongoose.Types.ObjectId(categoryId)] } }
            ]
          }
        },
        { $project: { categoryId: 1 } }
      ],
      as: "categories"
    }

    const checkCategorySizeMatcher = { categories: { $size: { $gt: 0 } } };

    if (!!categoryId && isValidObjectId(categoryId)) {
      totalQuery = totalQuery
        .lookup(lookupCategoryOptions)
        .match(checkCategorySizeMatcher)

      dataQuery = dataQuery
        .lookup(lookupCategoryOptions)
        .match(checkCategorySizeMatcher)
    }

    const [{ total } = { total: 0 }] = await totalQuery.count('total')
    const data = await dataQuery.skip(offset).limit(limit);

    return {
      total,
      data
    }
  },

  /**
   * 
   * @param {News & { seo?: SEOInfo; categoryIds?: string[] }} args 
   */
  async createNews(args) {
    const {
      _id,
      id,
      seo,
      categoryIds = [],
      ...newsData
    } = args;
    const data = await runTransaction(async (session) => {
      const timeServer = Date.now();
      const news = new NewsModel({
        ...newsData,
        createDate: newsData.status === STATUS_PUBLIC ? timeServer : null,
        lastUpdate: timeServer
      })
      await news.save({ session })
      /** @type {News & { seo?: SEOInfo; categoryIds?: string[] }} */
      const result = news.toObject();
      if (!!categoryIds.length && categoryIds.every((e) => isValidObjectId(e))) {
        await NewsInCategoryModel
          .bulkWrite(categoryIds.map((categoryId) => {
            return {
              updateOne: {
                filter: { categoryId, newsId: result._id },
                update: { $set: { index: timeServer } },
                upsert: true,
              }
            }
          }), { session })
        result.categoryIds = categoryIds;
      }
      if (!!seo) {
        const {
          _id, id, refId, refType,
          ...seoData
        } = seo
        const newSeo = new SEOInfoModel({
          ...seoData,
          refId: result._id,
          refType: SEORefType.News
        })
        await newSeo.save({ session })
        result.seo = newSeo.toObject()
      }
      return result
    })

    return data;
  },

  /**
   * 
   * @param {{ id: string }} args 
   */
  async getNewsById(args) {
    const {
      id
    } = args;
    if (!isValidObjectId(id)) return null;
    /** @type {Array<News & { seo?: SEOInfo }>} */
    const [n = null] = await NewsModel
      .aggregate()
      .match({ _id: new mongoose.Types.ObjectId(id) })
      .lookup({
        from: SEOInfoModel.collection.name,
        let: { refId: '$_id' },
        pipeline: [
          {
            $match: {
              $and: [
                { $expr: { $eq: ['$$refId', '$refId'] } },
                { $expr: { $eq: ['$refType', SEORefType.News] } }
              ]
            }
          }
        ],
        as: 'seo'
      })
      .unwind({ path: '$seo', preserveNullAndEmptyArrays: true })

    return n;
  },
  // async getNewsByCategoryId(args) {
  //   const { id } = args
  //   if (!isValidObjectId(id)) return null;
  //   const data = await NewsInCategoryModel.
  // },

  /**
   * 
   * @param {{
   *  id: string;
   *  updates?: Partial<Omit<News, "_id" | "id" | "authorId" | "createDate" | "lastUpdate">
   * }} args 
   */
  async partialUpdateNews(args) {
    const {
      id,
      updates
    } = args;
    if (!isValidObjectId(id)) return null;
    const timeServer = Date.now();
    if (updates.status === STATUS_PUBLIC) {
      const oldData = await NewsModel.findById(id).select("createDate");
      if (oldData && !oldData.createDate) updates.createDate = timeServer;
    }
    const newData = await NewsModel.findByIdAndUpdate(id, {
      $set: { ...updates, lastUpdate: timeServer }
    }, { new: true })
    return newData;
  },

  /**
   * 
   * @param {string} id 
   * @param {boolean} force 
   */
  async deleteNews(id, force) {
    if (force) return NewsModel.findByIdAndRemove(id);
    return NewsModel.findByIdAndUpdate(id, { $set: { status: STATUS_DELETED, lastUpdate: Date.now() } })
  }
}