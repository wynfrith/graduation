
import UserService from "../services/UserService";

export const list = async ctx =>{
  // ?role=user&isBan=true&search=key12&page=2
  const query = ctx.query;
  const limit = 10;
  
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
    typeName: typeName,
    isInvalid: query.isBan
  })
};

export const detail = async ctx => {
  let user = await UserService.getUserByName(ctx.params.username);
  if (!user) ctx.redirect('/admin/user');
  
  await ctx.render('admin/udetail', {user: user});
};

const ban = async ctx => {
  let {ids} = ctx.request.body;
  ids = ids.split(';');
  let res = {code: 0};
  for(let id of ids) {
    res = await UserService.banUser(id);
    if (res.code > 0 ) {
      break;
    }
  }
  ctx.body = res;
  
};

const unBan = async (ctx) => {
  let {ids} = ctx.request.body;
  ids = ids.split(';');
  let res = {code: 0};
  for(let id of ids) {
    res = await UserService.unBanUser(id);
    if (res.code > 0 ) {
      break;
    }
  }
  ctx.body = res;
};

const remove = async (ctx) => {
  let {ids} = ctx.request.body;
  ids = ids.split(';');
  let res = {code: 0};
  for(let id of ids) {
    res = await UserService.deleteUser(id);
    if (res.code > 0 ) {
      break;
    }
  }
  ctx.body = res;
};

export {ban, unBan, remove}