/**
 * Created by wyn on 5/4/16.
 */
import NotifyService from '../services/NotifyService'

export default class AnnounceController {

  static async list (ctx) {
    const announces = await NotifyService.getAnnounces();
    console.log(announces);
    await ctx.render('admin/announce', { announces: announces})
  }

  static async post (ctx) {
    const { text } = ctx.request.body;
    const content = `<span class="mark">「系统公告」</span> ${text}`
    ctx.body = await NotifyService.createAnnounce(ctx.session.user.username, content);
  }
}

