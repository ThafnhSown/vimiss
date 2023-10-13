import SEOInfo, { SEORefType } from "@gitlab-koolsoft-dev/vimiss-portal-config/models/SEOInfo";

export default {
  /**
   * @typedef {Partial<Omit<SEOInfo, "_id" | "id" | "refId" | "refType">} SEOInfoUpdateData
   * @typedef {SEOInfoUpdateData & { id: string }} PartialUpdateSEOInfoByIdArgs
   * @typedef {SEOInfoUpdateData & { refId: string; refType: SEORefType }} PartialUpdateSEOInfoByRefArgs
   * @param {PartialUpdateSEOInfoByIdArgs | PartialUpdateSEOInfoByRefArgs} args 
   */
  async partialUpdateSEOInfo(args) {
    const {
      id, refId, refType,
      ...updates
    } = args;
    const newData = await SEOInfoModel.findOneAndUpdate(
      { $or: [{ _id: id }, { refId, refType }] },
      { $set: { ...updates } },
      { new: true }
    )
    return newData;
  }
}