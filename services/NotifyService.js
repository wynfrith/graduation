/**
 * Created by wyn on 3/25/16.
 */
import Subscription from '../models/Subscription'
import Notify from '../models/Notify'
import UserNotify from '../models/UserNotify'

class NotifyService {

  static async subscribe (userId, target, targetType) {
    await Subscription.findOneAndUpdate(
      {uid: userId, target: target, targetType: targetType},
      {uid: userId, target: target, targetType: targetType},
      {upsert: true}
    );
  }

  static async unsubscribe (userId, target, targetType) {
    await Subscription.remove({uid: userId, target: target, targetType: targetType});
  }

  // 向订阅者们创建提醒
  static async createRemind (target, targetType, sender, action, content) {
    // create notify to all described user
    const subs = await Subscription.find({target: target, targetType: targetType});
    const events = [];
    for (let sub of subs) {
      let notify = new Notify({
        content: content,
        type: 'remind',
        target: target,
        targetType: targetType,
        sender: sender,
        receiver: sub.uid,
        action: action
      });
      events.push(notify.save());
    }
    await Promise.all(events);
  }
  
  static async createAnnounce(sender, content) {
    let notify = new Notify({
      content: content,
      type: 'announce',
      sender: sender
    });
    await notify.save();
  }

  // 拉取一个用户的用户提醒
  static async pullRemind (userId) {
    //首先找出最后一条userNotify提醒
    const last = await UserNotify.findOne({userId: userId}).sort({createdAt: -1});
    let filter = { receiver: userId, type: 'remind'};
    if (last) filter['createdAt'] = {  $gt: last.createdAt };
    /// 获取大约最后一条时间的该用户订阅的所有notify
    const notifies = await Notify.find(filter);
    //创建UserNotifies并保存
    const events = [];
    for (let notify of notifies){
      let userNotify = new UserNotify({
        content: notify.content,
        isRead: false,
        userId: notify.receiver,
        notifyId: notify._id,
        notifyType: notify.type
      });
      events.push(userNotify.save());
    }
    await Promise.all(events);
  }

  // 拉取公告
  static async pullAnnounce(userId) {
    const last = await UserNotify.findOne({userId: userId}).sort({createdAt: -1});
    let filter = { type: 'announce'};
    if (last) filter['createdAt'] = {  $gt: last.createdAt };
    const notifies = await Notify.find(filter);
    const events = [];
    for (let notify of notifies){
      let userNotify = new UserNotify({
        content: notify.content,
        isRead: false,
        notifyId: notify._id,
        notifyType: notify.type
      });
      events.push(userNotify.save());
    }
    await Promise.all(events);
  }

  static async getUserNotify(userId) {
    return await UserNotify.find({userId: userId});
  }

  static async readNotify (nid) {
    await UserNotify.findOneAndUpdate({_id: nid}, { isRead: true});
  }

}
// const NotifyService = {
//
//   // 订阅
//   subscribe: async () => {},
//
//   // 这三个方法会创建不同类型的notify
//   createAnnounce: (content, sender) => {},
//   createRemind: (content, sender, target, targetType, action) => {},
//   createMessage: (content, sender, receiver) => {},
//
//
//   //从Notify拉取消息到UserNotify中
//   pullAnnounce: (userId) => {},
//   pullRemind: (userId) => {},
//   pullAll: (userId) => {},
//
//
//   /**
//    * 获取用户的UserNotify列表
//    * @param userId
//    */
//   getUserNotify: (userId) => {},
//
//   /**
//    * 更新某一条通知, 把isRead设为true
//    * @param userId
//    * @param notifyId
//    */
//   readNotify:(userId, notifyId) => {}
// };
export default NotifyService;
