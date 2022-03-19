const express = require("express");
const router = express.Router()
const postRouter = require("./post.router")
const authRouter = require("./auth.router")


router.use("/",postRouter)
router.use("/",authRouter)


module.exports = router