
const postServices = require("../services/posts.services")

const getGatheringPosts = async(req,res,next) => {
	try{
		const gatheringId = req.params.gatheringId;
		const posts = await postServices.getGatheringPosts(gatheringId);
		return res.json({ posts });
	} catch(err){
		return next(err)
	}
};

const createPost = async(req,res,next) => {
	try{
		const gatheringId = req.params.gatheringId;
		const body = req.body;
		const post = await postServices.createPost(gatheringId, body);
		return res.json({ post })
	} catch(err){
		return next(err)
	}
};

const editPost = async(req,res,next) => {
	try{
		const postId = req.params.postId;
		const body = req.body;
		const post = await postServices.editPost(postId, body);
		return res.json({ post })
	} catch(err){
		return next(err)
	}
};

const deletePost = async(req,res,next) => {
	try{
		const postId = req.params.postId;
		await postServices.deletePost(postId);
		return res.status(204).send();
	} catch(err){
		return next(err)
	}
}

const createComment = async(req,res,next) => {
	try{
		const postId = req.params.postId;
		const body = req.body;
		const comment = await postServices.createComment(postId, body);
		return res.json({ comment });
	} catch(err){
		return next(err)
	}
};

const editComment = async(req,res,next) => {
	try{
		const commentId = req.params.commentId;
		const body = req.body;
		const comment = await postServices.editComment(commentId, body);
		return res.json({ comment })
	} catch(err){
		return next(err)
	}
};

const deleteComment = async(req,res,next) => {
	try{
		const commentId = req.params.commentId;
		await postServices.deleteComment(commentId);
		return res.status(204).send();
	} catch(err){
		return next(err)
	}
};


module.exports = {
	getGatheringPosts,
	createPost,
	editPost,
	deletePost,
	createComment,
	editComment,
	deleteComment
}