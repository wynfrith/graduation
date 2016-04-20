
import UserService from "../services/UserService";

export const list = async ctx =>{
  // ?role=user&isBan=true&search=key12&page=2
  const query = ctx.query;
  const limit = 3;
  
  let [users, userCount] = await UserService.getUsers({
    filter: {
      role: query.role,
      isBan: query.isBan
    },
    search: query.search,
    page: query.page,
    limit: limit
  });

  // 用户类型显示
  let typeName = query.isBan ? '封号用户' : query.role == 'user' ? '普通用户' : ( query.role == 'admin' ? '管理员' : '全部用户');

  await ctx.render('admin/user', {
    users: users,
    page: query.page || 1,
    pageNum: Math.ceil(userCount / limit),
    searchText: query.search,
    typeName: typeName
  })
};

export const detail = async ctx => {
  let user = await UserService.getUserByName(ctx.params.username);
  if (!user) ctx.redirect('/admin/user');
  
  await ctx.render('admin/udetail', {user: user});
};