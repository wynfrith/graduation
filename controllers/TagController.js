import TagService from "../services/TagService";
export const list = async (ctx) => {
  let limit = 20, page = 1;
  let [tags, count] = await TagService.getTags({
    page: page,
    limit: limit
  });

  console.log(tags);
  console.log(count);

  await ctx.render('admin/tag', {
    tags: tags,
    page: page,
    pageNum: Math.ceil(count/ limit),
  });
};