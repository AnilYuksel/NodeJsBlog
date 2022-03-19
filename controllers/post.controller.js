const { Mongoose } = require("mongoose");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const path = require("path");
// const asyncErrorWrapper = require("express-async-handler")


const getHomePage = (req, res, next) => {
  const postPerPage = 3
  const page = req.query.page || 1

  Post.find()
  .populate({path:"author", model:User})
  .sort({$natural:-1})
  .skip((postPerPage * page) - postPerPage)
  .limit(postPerPage)
  .then(posts=>{
    Post.countDocuments().then(postCount=>{
      res.render("pages/home", {
      pageTitle: "Home Page",
      posts: posts,
      current: parseInt(page),
      pages: Math.ceil(postCount/postPerPage)
      });
    })   
  })
};

const postAddPost = async (req, res, next) => {
  const { postTitle, postText, date } = req.body;
  const postImage = req.files.postImage

  postImage.mv(path.resolve(__dirname, "../public/img", postImage.name));

  const post = new Post({
    postTitle,
    postText,
    date,
    postImage: `/img/${postImage.name}`,
    author: req.session.user._id 
  });
  await post.save();
  res.redirect("/");
};

const getAddPost = (req, res, next) => {
    res.render("pages/add", { pageTitle: "Add Post" });
};

const postEditPost = async (req, res, next) => {
  const { postId, postTitle, postText } = req.body;
  const postImage = req.files.postImage

  postImage.mv(path.resolve(__dirname, "../public/img", postImage.name));
  let post = await Post.findById(postId);

  post.postTitle = postTitle;
  post.postText = postText;
  post.postImage = `/img/${postImage.name}`,
  
  post = await post.save();
  res.redirect("/");
};

const getById = (postId) => {
  return Post.findById(postId, (err, data) => {
    if (err) console.log(err);
    return data;
  }).clone();
};

const getEditPost = async (req, res, next) => {
  const { postId } = req.params;
  const posts = await getById(postId);
  res.render("pages/edit", {
    pageTitle: "Edit Page",
    posts: posts,
  });
};

const deletePost = (req, res, next) => {
  const { postId } = req.params;
  Post.findByIdAndDelete(postId)

    .then((result) => {
      res.json();
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/");
};

const getReadMore = (req, res, next) => {
  const { postId } = req.params;
  Post.findById(postId)
  .populate({path:"author", model:User})
  .sort({$natural:-1})
  .then(posts=>{
    res.render("pages/readMore", {
      pageTitle: "Read More Page",
      posts: posts,
    });
  })
};

const getPostDetails = async (req, res, next) => {
  let  userInfo  = req.session.user.userName
  let  {postId}  = req.params;

  Post.findById(postId)
  .populate({path:"author", model:User})
  .then(posts=>{
    if(posts.author.userName === userInfo){
    res.render("pages/postDetails", {
      pageTitle: "Post Details Page",
      posts: posts,
    })}else{
      res.send({
        message: "Only the post owner can access the details"
      })
    }
  })
};


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
const getSearch = (req,res,next)=>{
  const postPerPage = 3
  const page = req.query.page || 1

    if (req.query.search) {
       const regex = new RegExp(escapeRegex(req.query.search), 'gi');
       Post.find({ "postTitle": regex })
       .populate({path:"author", model:User})
       .sort({$natural:-1})
       .skip((postPerPage * page) - postPerPage)
       .limit(postPerPage)
       .then(posts=>{  
        Post.countDocuments().then(postCount=>{
        res.render("pages/home", {
          pageTitle: "Home Page",
          posts: posts,
          current: parseInt(page),
          pages: Math.ceil(postCount/postPerPage)
          });
        })
       }); 
    }
}


module.exports = {
  getHomePage,
  postAddPost,
  getAddPost,
  postEditPost,
  getEditPost,
  getById,
  deletePost,
  getReadMore,
  getPostDetails,
  getSearch,
  // postComment
  
};
