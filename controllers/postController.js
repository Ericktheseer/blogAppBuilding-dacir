const Post = require("../models/Post");

// Create Blog Post
module.exports.createPost = async (req, res) => {

    try {

        const { title, content } = req.body;

        const newPost = new Post({
            title,
            content,
            author: req.user.id
        });

        const savedPost = await newPost.save();

        return res.status(201).send({
            message: "Post created successfully",
            post: savedPost
        });

    } catch(error){

        return res.status(500).send({
            message: error.message
        });

    }

};

// Get All Blog Posts
module.exports.getAllPosts = async (req, res) => {

    try {

        const posts = await Post.find({})
            .populate("author", "username email")
            .sort({ createdAt: -1 });

        return res.status(200).send({
            posts
        });

    } catch(error){

        return res.status(500).send({
            message: error.message
        });

    }

};

// Get Single Blog Post
module.exports.getSinglePost = async (req, res) => {

    try {

        const post = await Post.findById(req.params.postId)
            .populate("author", "username email");

        if(!post){
            return res.status(404).send({
                message: "Post not found"
            });
        }

        return res.status(200).send({
            post
        });

    } catch(error){

        return res.status(500).send({
            message: error.message
        });

    }

};

// Update Blog Post
module.exports.updatePost = async (req, res) => {

    try {

        const { title, content } = req.body;

        const post = await Post.findById(req.params.postId);

        if(!post){
            return res.status(404).send({
                message: "Post not found"
            });
        }

        if(post.author.toString() !== req.user.id){
            return res.status(403).send({
                message: "You are not allowed to update this post"
            });
        }

        post.title = title;
        post.content = content;

        const updatedPost = await post.save();

        return res.status(200).send({
            message: "Post updated successfully",
            post: updatedPost
        });

    } catch(error){

        return res.status(500).send({
            message: error.message
        });

    }

};

// Delete Blog Post
module.exports.deletePost = async (req, res) => {

    try {

        const post = await Post.findById(req.params.postId);

        if(!post){
            return res.status(404).send({
                message: "Post not found"
            });
        }

        if(post.author.toString() !== req.user.id && !req.user.isAdmin){
            return res.status(403).send({
                message: "You are not allowed to delete this post"
            });
        }

        await Post.findByIdAndDelete(req.params.postId);

        return res.status(200).send({
            message: "Post deleted successfully"
        });

    } catch(error){

        return res.status(500).send({
            message: error.message
        });

    }

};