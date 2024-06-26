const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
  dislikes: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
  ],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  createdDate: { type: Date, default: Date.now },
  editedStatus: { type: Boolean, default: false },
});

const Thread = mongoose.model("Thread", threadSchema);

module.exports = Thread;
