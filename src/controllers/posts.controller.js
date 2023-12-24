
const postServices = require("../services/posts.services")

/**
 * @route GET '/events/:eventId/comments
 * @desc get comments for an event
 * @access Restricted - event participants only
 */
const getEventComments = async(req,res,next) => {
	try{
		const eventId = req.params.eventId;
		const posts = await postServices.getEventComments(eventId);
		return res.json({ posts });
	} catch(err){
		return next(err);
	};
};

/**
 * @route POST '/events/:eventId/comments'
 * @desc create a comment for an event
 * @access Restricted - event participants only
 */
const createComment = async(req,res,next) => {
	try{
		const eventId = req.params.eventId;
		const comment = req.body.comment;
		const author = req.body.author ;
		const comments = await postServices.createComment(eventId, comment, author);
		return res.json({ comments });
	} catch(err){
		return next(err);
	};
};

/**
 * @route PUT 'events/:eventId/comments/:commentId
 * @desc edit comment
 * @access Restricted - host or comment author only
 */
const editPost = async(req,res,next) => {
	try{
		const postId = req.params.postId;
		const body = req.body;
		const post = await postServices.editPost(postId, body);
		return res.json({ post });
	} catch(err){
		return next(err);
	};
};

/**
 * @route DELETE '/events/:eventId/comments/:commentId
 * @desc delete a comment
 * @access Restricted - host or comment author only
 */
const deleteComment = async(req,res,next) => {
	try{
		const commentId = req.params.commentId;
		await postServices.deleteComment(commentId);
		return res.status(204).send();
	} catch(err){
		return next(err);
	};
};


module.exports = {
	getEventComments,
	editPost,
	createComment,
	deleteComment
}

/** Hanldes post request to create a new comment on a post.
 * Request Data - 
 * 		params.postId
 * 		body: { body: <string>}
 * Returns response with json body.
 * 		{
 * 			"comment": {
				"id": <num>,
				"body": <string>,
				"postid": <num>,
				"author": <string>
			}
 * 		}
 */
// const createComment = async(req,res,next) => {
// 	try{
// 		const postId = req.params.postId;
// 		const input = req.body;
// 		const author = res.locals.user.username
// 		const comment = await postServices.createComment(postId, input, author);
// 		return res.json({ comment });
// 	} catch(err){
// 		return next(err)
// 	}
// };