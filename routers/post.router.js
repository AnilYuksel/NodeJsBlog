const express = require("express");
const router = express.Router()
const postController = require("../controllers/post.controller")

router.get("/",postController.getHomePage)
router.post("/add-post",postController.postAddPost)
router.get("/add-post",postController.getAddPost)
router.post("/edit-post/:postId",postController.postEditPost)
router.get("/edit-post/:postId",postController.getEditPost)
router.post("/delete-post/:postId",postController.deletePost)
router.get("/read-more/:postId",postController.getReadMore)
router.get("/post-details/:postId",postController.getPostDetails)
router.get("/search",postController.getSearch)





module.exports = router