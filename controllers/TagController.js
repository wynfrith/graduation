import TagService from "../services/TagService";
export const list = async (ctx) => {
  let limit = 20, page = 1;
  let tags = await TagService.getAllTags();

  await ctx.render('admin/tag', {
    tags: tags
  });
};