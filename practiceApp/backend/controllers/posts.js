const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  // console.log(req.query)
  let findQuery = Post.find();
  let pagesize = +req.query.pagesize;
  let currentpage = +req.query.currentpage;
  let savedPosts;
  if (pagesize && currentpage) {
    findQuery.skip(pagesize * (currentpage - 1)).limit(pagesize);
  }
  findQuery
    .then((documents) => {
      savedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "success",
        posts: savedPosts,
        totalPost: count,
      });
    });
};

exports.getPostsByID = (req, res, next) => {
  Post.findById(req.params.id).then((response) => {
    if (response) res.status(200).json(response);
    else {
      res.status(404).json({ message: "post not found." });
    }
  });
};

exports.savePosts = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.UserId,
  });
  post
    .save()
    .then(() => {
      console.log(post);
      res.status(201).json({
        message: "post added successfully.",
        savedpost: post,
      });
    })
    .catch(() => {
      console.log("post not added.");
    });
};

exports.updatePost = (req, res, next) => {
  console.log('reached backend api')
  if (!req.body.imagePath) {
    const url = req.protocol + "://" + req.get("host");
    req.body = {
      _id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.UserId,
    };
  }
  console.log(req.body);
  Post.updateOne(
    { _id: req.params.id, creator: req.userData.UserId },
    req.body
  ).then((result) => {
    console.log(result)
    if (result.n > 0) {
      res.status(200).json({
        message: "update successful.",
      });
    } else {
      res.status(401).json({
        message: "Authorization failed.",
      });
    }
  });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.UserId })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "deletion successful.",
        });
      } else {
        res.status(401).json({
          message: "Authorization failed.",
        });
      }
    })
    .catch((err) => {
      console.log("post not deleted.", err);
    });
};
