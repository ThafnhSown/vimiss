import { successResponse } from "@/common/responses";
import commentService from "@/services/comment.service";


export default {
  async listCommentInNews(req, res) {
    const newsId = req.params.id
    const data = await commentService.getCommentInNews(newsId)
    return successResponse(res, data)
  },
  
  async createComment(req, res) {
    const data = await commentService.createComment(req.body);
    return successResponse(res, data);
  }
 
}