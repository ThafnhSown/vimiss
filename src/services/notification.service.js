import { NotificationModel } from "@/db/models/Notification";
export default {
  
  async createNotification(args) {
    const {
      userId, 
      newsId,
      senderId
    } = args;
    const message = `User has commented in ${newsId}`
    const data = await NotificationModel.create({
      userId,
      newsId,
      senderId,
      message
    })
    return data
  },
}

