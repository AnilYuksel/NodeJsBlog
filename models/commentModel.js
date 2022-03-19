const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  commentText: {
      type: String,
      required : true
  },
});



module.exports = mongoose.model("Comment", commentSchema);