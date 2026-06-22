const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const auth = require("../auth");

router.post("/", auth.verify, postController.createPost);

router.get("/", postController.getAllPosts);

router.get("/:postId", postController.getSinglePost);

router.patch("/:postId", auth.verify, postController.updatePost);

router.delete("/:postId", auth.verify, postController.deletePost);

module.exports = router;