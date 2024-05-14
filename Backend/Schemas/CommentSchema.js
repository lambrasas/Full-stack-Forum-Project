const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  threadId: { type: Schema.Types.ObjectId, ref: "Thread", required: true },
  parentId: { type: Schema.Types.ObjectId, ref: "Comment" },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdDate: { type: Date, default: Date.now },
  editedStatus: { type: Boolean, default: false },
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
