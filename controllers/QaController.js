import QaService from "../services/QaService";

const list = async (ctx) => {
  const query = ctx.query;
  const limit = 10;

  let questions, count;
  if (query.search && query.search.trim() != '') {
    [questions, count] = await QaService.searchQuestions(query.search, {
      page: query.page,
      limit: limit
    })
  } else {
    [questions, count] = await QaService.getQuestions({
      page: query.page,
      limit: limit
    });
  }
  
  await ctx.render('admin/question', {
    questions: questions,
    page: query.page || 1,
    pageNum: Math.ceil(count / limit),
    searchText: query.search
  });
};

// 删除问题或答案
const remove = async (ctx) => {
  const { id } = ctx.request.body;
  console.log(id);
  ctx.body = await QaService.deleteQa(id);
};

const removeComments = async (ctx) => {
  const {qid, id} = ctx.request.body;
  // TODO: 删除评论
};

export { list, remove ,removeComments }
