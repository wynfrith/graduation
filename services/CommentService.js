import Comment from "../models/Comment";
import {Ok} from "../utils/error";
import {SaveError} from "../utils/error";
import {NotFoundError} from "../utils/error";
/**
 * Created by wyn on 3/25/16.
 */
const  CommentService = {
  
  createComment: async (content, qaId, user) => {
    let comment = new Comment({
      content: content,
      authorId:user._id,
      author: user.username,
      qaId: qaId
    });

    try {
      return Ok(await comment.save());
    } catch (err) {
      return SaveError(err)
    }
    
  },

  removeComment: async (cid) => {
    let comment = await Comment.findOne({is_del: false, _id: cid});
    if(!comment) return NotFoundError();
    comment.isDel = true;
    try {
      return Ok(await comment.save());
    } catch (err) {
      return SaveError(err);
    }
  },

  getCommentsByQa: async (qaId) => {
    return await Comment.find({is_del: false, qaId: qaId}).sort({createAt: 1});
  }

};

export  default CommentService;