/**
 * Created by wyn on 3/25/16.
 */

const NotifyService = {

  // 这三个方法会创建不同类型的notify
  createAnnounce: (content, sender) => {},
  createRemind: (content, sender, target, targetType, action) => {},
  createMessage: (content, sender, receiver) => {},


  //从Notify拉取消息到UserNotify中
  pullAnnounce: (userId) => {},
  pullRemind: (userId) => {},
  pullAll: (userId) => {},


  /**
   * 获取用户的UserNotify列表
   * @param userId
   */
  getUserNotify: (userId) => {},

  /**
   * 更新某一条通知, 把isRead设为true
   * @param userId
   * @param notifyId
   */
  readNotify:(userId, notifyId) => {}
}
export default NotifyService;
