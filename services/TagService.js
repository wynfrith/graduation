import Tag from "../models/Tag";
import {Ok, SaveError, NotFoundError, ConstraintsError} from "../utils/error";
/**
 * Created by wyn on 3/25/16.
 */

const TagService = {

  // tag的增删改查

  createTag: async (tag, parentId) => {
    tag.parentId = parentId;
    tag = new Tag(tag);
    try {
      return Ok(await tag.save());
    } catch (err) {
      return SaveError(err);
    }
  },

  // 移除tag首先检查有没有子标签
  deleteTag: async (tagId) => {
    let tag = await Tag.findOne({is_del: false, _id: tagId});
    if(!tag) return NotFoundError();

    let count = await Tag.count({is_del: false, parentId: tagId});
    if (count > 0) {
      return ConstraintsError();
    } else {
      try {
        return Ok(await Tag.update({_id: tagId}, {is_del: true}));
      } catch (err){
        return SaveError(err);
      }
    }
  },

  // 移除摸个标签, 并且递归移除子标签
  deleteTagForce: async (tagId) => {
    let tag = await Tag.findOne({is_del: false, _id: tagId});
    if(!tag) return NotFoundError();

    let children = await Tag.find({is_del: false, parentId: tagId});
    const tasks = [];
    for (let child of children) {
      let task = Tag.remove({is_del:false, _id: child._id});
      tasks.push(task);
    }
    await Promise.all(tasks);
  },

  updateTag:async (tagId, tag) => {
    try {
      let tag = await Tag.findOneAndUpdate(
        {isDel: false, _id: tagId }, tag ,{runValidators: true});
      return Ok(tag);
    } catch (err) {
      return SaveError(err);
    }
  },

  getTagByName: async (name) => {
    return await Tag.findOne({ isDel: false, name: name });
  },
  
  getTagById: async (tagId) => {
    return await Tag.findOne({ isDel: false, _id: tagId });
  },
  
  // 获取parentId下的所有tags
  getTags: async ({ page = 1,limit = 10, sort = { createAt: -1 }, parentId = ''} = {}) => {
    let filter = { isDel: false};
    let skip = (page - 1) * limit;
    skip  = skip > 0 ? skip : 0;

    return Promise.all([
      await Tag.find(filter).skip(skip).limit(limit).sort(sort),
      await Tag.find(filter).count()
      ])
  },
  
  getTagsCount: async (parentId) => {
    return await Tag.count({isDel: false, parentId: parentId });
  }


};

export default TagService;