const express = require("express");
const {
  getPosts,
  getPost,
  addPost,
  deletePost
} = require("../controllers/posts");

const router = express.Router({ mergeParams: true });

 
router.route("/").get(getPosts).post(addPost);
router.route("/:id").get(getPost).delete(deletePost);


module.exports = router;
