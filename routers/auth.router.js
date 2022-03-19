const express = require("express");
const router = express.Router()
const postController = require("../controllers/auth.controller")

router.get("/login",postController.getLogin)
router.post("/login",postController.postLogin)
router.get("/signup",postController.getSignUp)
router.post("/signup",postController.postSignUp)
router.post("/logout",postController.postLogout)


module.exports = router