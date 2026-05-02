const { Post } = require('../models');

exports.createPost = async (req, res) => {
  try {
    const post = await Post.create({
      ...req.body,
      userId: req.user.id,
      userName: req.user.name,
      userAvatar: req.user.avatar,
    });
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.send(posts);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.reactToPost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }
    
    const { reaction } = req.body;
    const currentReactions = { ...post.reactions };
    currentReactions[reaction] = (currentReactions[reaction] || 0) + 1;
    
    post.reactions = currentReactions;
    await post.save();
    res.send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};
