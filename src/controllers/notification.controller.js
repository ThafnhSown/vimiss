import { successResponse } from "@/common/responses";
import notificationService from "@/services/notification.service";


export default {
  async createNotification(req, res) {
    const data = await notificationService.createNotification(req.body);
    return successResponse(res, data);
  }
 
}