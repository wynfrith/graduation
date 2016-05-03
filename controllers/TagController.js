import TagService from "../services/TagService";

const list = async (ctx) => {
  let limit = 20, page = 1;
  let tags = await TagService.getAllTags();

  await ctx.render('admin/tag', {
    tags: tags
  });
};

const add = async (ctx) => {
  const {name, memo} = ctx.request.body;
  let res = await TagService.createTag({ name: name, memo: memo})
  if (res.code == 1) {
    if (res.errors && res.errors.code == 11000 ) {
      res.msg = '标签名称已存在';
    } else {
      res.msg = '添加失败'
    }
  }
  ctx.body = res;
};

const remove = async (ctx) => {
  const { id } = ctx.request.body;
  ctx.body = await TagService.deleteTag(id);
};

const edit = async (ctx) => {
  const {id, name, memo} = ctx.request.body;
  let res = await TagService.updateTag(id, { name: name, memo: memo});
  if (res.code == 1) {
    if (res.errors && res.errors.code == 11000 ) {
      res.msg = '标签名称已存在';
    } else {
      res.msg = '添加失败'
    }
  }
  ctx.body = res;
};

export { add, list , remove, edit}