const express = require("express");
const {
  getPosts,
  getPost,
  addPost,
  deletePost
} = require("../controllers/posts");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getPosts) 
 .post(protect, authorize('user', 'admin'), addPost);


router
  .route("/:id")
  .get(protect, getPost)
  .delete(protect, deletePost)

module.exports = router;
