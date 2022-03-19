const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  postTitle: {
    type: String,
    required: [true, "Please enter title of your post"],  
  },
  postText: {
    type: String,
    required: [true, "Please enter your post"],  
  },
  date: {
    type:Date,
    default: Date.now
  },
  postImage: {
    type:String
  },
  author: {
    type: Schema.Types.ObjectId, 
    ref: 'Users'
  },
  comments: {
    type: Schema.Types.ObjectId,
    ref: 'Comments'
  }
});

module.exports = mongoose.model("Post", postSchema);
