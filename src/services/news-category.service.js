import { NewsCategoryModel } from "@/db/models/NewsCategory";
import { SEOInfoModel } from "@/db/models/SEOInfoModel";
import { isValidObjectId, runTransaction } from "@/utils/mongo";
import { NewsCategory, SEOInfo } from "@gitlab-koolsoft-dev/vimiss-portal-config";
import { STATUS_DELETED, STATUS_PRIVATE, STATUS_PUBLIC } from "@gitlab-koolsoft-dev/vimiss-portal-config/contraint";
import { SEORefType } from "@gitlab-koolsoft-dev/vimiss-portal-config/models/SEOInfo";
import mongoose from "mongoose";

export default {
  /**
   * 
   * @param {{
   *  offset?: number;
   *  limit?: number;
   *  withPrivate?: boolean;
   *  slug?: string;
   *  locale?: string;
   * }} args 
   */
  async listCategories(args) {
    const {
      offset = 0,
      limit = 10,
      withPrivate,
      slug,
      locale
    } = args;

    if (!limit) return { total: 0, data: [] }
    const filter = { status: withPrivate ? { $in: [STATUS_PUBLIC, STATUS_PRIVATE] } : { $in: [STATUS_PUBLIC] } }
    if (!!slug) filter.slug = slug;
    if (!!locale) filter.locale = locale;

    const total = await NewsCategoryModel.countDocuments(filter)

    /** @type {Array<NewsCategory>} */
    const categories = await NewsCategoryModel
      .aggregate()
      .match(filter)
      .sort({ index: 1 })
      .skip(offset)
      .limit(limit)

    return {
      total,
      data: categories
    };
  },

  /**
   * 
   * @param {{
   *  id: string;
   * }} args 
   */
  async getCategoryById(args) {
    const {
      id
    } = args;
    if (!isValidObjectId(id)) return null;
    /** @type {Array<NewsCategory & { seo?: SEOInfo }>} */
    const [c = null] = await NewsCategoryModel
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
                { $expr: { $eq: ['$refType', SEORefType.NewsCategory] } }
              ]
            }
          }
        ],
        as: 'seo'
      })
      .unwind({ path: '$seo', preserveNullAndEmptyArrays: true })
    return c;
  },

  /**
   * 
   * @param {NewsCategory & { seo?: SEOInfo }} args 
   */
  async createCategory(args) {
    const {
      _id, id,
      seo,
      ...categoryData
    } = args;

    const data = await runTransaction(async (session) => {
      const timeServer = Date.now();
      const newCategory = new NewsCategoryModel({
        ...categoryData,
        createDate: timeServer,
        lastUpdate: timeServer,
        index: timeServer
      })
      await newCategory.save({ session })
      /** @type {NewsCategory & { seo?: SEOInfo }} */
      const result = newCategory.toObject();

      if (!!seo) {
        const {
          _id, id, refId, refType,
          ...seoData
        } = seo
        const newSeo = new SEOInfoModel({
          ...seoData,
          refId: newCategory._id,
          refType: SEORefType.NewsCategory
        })
        await newSeo.save({ session })
        result.seo = newSeo.toObject()
      }
      return result;
    })
    return data;
  },

  /**
   * 
   * @param {{
   * id: string;
   * updates?: Partial<Pick<NewsCategory, 
   * "avatar" | "title" | "desc" | "slug" | "status" | "parentId" | "type" | "index" | "locale"
   * >>
   *}} args 
   */
  async partialUpdateCategory(args) {
    const { id, updates } = args;

    const newData = await NewsCategoryModel.findByIdAndUpdate(id, {
      $set: { ...updates, lastUpdate: Date.now() }
    }, { new: true })
    return newData;
  },

  /**
   * 
   * @param {string} id 
   * @param {boolean} [force]
   */
  async deleteCategory(id, force) {
    if (force) return NewsCategoryModel.findByIdAndRemove(id);
    return NewsCategoryModel.findByIdAndUpdate(id, { $set: { status: STATUS_DELETED, lastUpdate: Date.now() } })
  }
}