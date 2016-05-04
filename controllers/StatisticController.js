/**
 * Created by wyn on 5/4/16.
 */

export default class StatisticController{
  static async userStatistic (ctx) {
    await ctx.render('admin/user-statistic');
  }
}
