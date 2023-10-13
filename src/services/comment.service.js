import { CommentModel } from "@/db/models/Comment";

export default {
 async createComment(args) {
    const {
        account, 
        avatar,
        userId, 
        newsId, 
        content
    } = args;
    const data = await CommentModel.create({account, avatar, userId, newsId, content})
    return data
 }, 

 async getCommentInNews(args) {
    const newsId = args;
    const limit = 10;
    const data = await CommentModel.find({ newsId: newsId}).limit(limit).exec()
    return data
 }
}