
import UserService from "../services/UserService";

export const list = async ctx =>{
  // ?role=user&isBan=true&search=key1+key2&page=2
  const query = ctx.query;
  const limit = 6;
  let [users, userCount] = await UserService.getUsers({
    filter: {
      role: query.role,
      isBan: query.isBan
      // search模糊匹配
    },
    page: query.page,
    limit: limit
  });
  
  console.log(users, userCount);
  
  await ctx.render('admin/user', {
    users: users,
    page: query.page || 1,
    pageNum: Math.ceil(userCount / limit)
  })
};

export const detail = async ctx => {
  console.log(ctx.params);
  await ctx.render('admin/')
};