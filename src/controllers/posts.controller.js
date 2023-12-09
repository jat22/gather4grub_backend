
const postServices = require("../services/posts.services")

/** Handle get request to retrieve all posts for a event.
 * Request data -
 * 		params.eventId
 * Return response with json body.
 * 		{
 * 			posts:[
 * 
	* 			{
	* 				id:<num>,
	* 				title: <string>,
	* 				body:<string>,
	* 				eventId:<num>,
	* 				author:<string>,
					comments: [
						{
							id:<num>,
							body:<string>,
							author:<string>
						}
					]
	* 			}
			]
 * 		}
 */
const getEventPosts = async(req,res,next) => {
	try{
		const eventId = req.params.eventId;
		const posts = await postServices.getEventComments(eventId);
		return res.json({ posts });
	} catch(err){
		return next(err)
	}
};

/** Handle post request to create a new post.
 * Request data - 
 * 		params.eventId
 * 		body: {
 * 			title:<string>,
 * 			body:<string>,
 * 		}
 * Return response with json body.
 * 		{
 * 			post:{
 * 				id:<num>,
 * 				title: <string>,
 * 				body:<string>,
 * 				eventId:<num>,
 * 				author:<string>
 * 			}
 * 		}
 */
const createPost = async(req,res,next) => {
	try{
		const eventId = req.params.eventId;
		const comment = req.body.comment
		const author = req.body.author 
		const comments = await postServices.createComment(eventId, comment, author);
		return res.json({ comments })
	} catch(err){
		return next(err)
	}
};

/** Handle put request to edit a post.
 * Request data - 
 * 		params.postId
 * 		body: {
 * 			body:<string>
 * 		}
 * Return response with json body.
 * 		{
 * 			post:{
 * 				id:<num>,
 * 				title: <string>,
 * 				body:<string>,
 * 				eventId:<num>,
 * 				author:<string>
 * 			}
 * 		}
 */
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
/** Hanlde delete request to remove a post.
 * Request data - 
 * 		params.postId
 * 
 * Returns response status 204 with empty body.
 */
const deleteComment = async(req,res,next) => {
	try{
		const commentId = req.params.commentId;
		await postServices.deleteComment(commentId);
		return res.status(204).send();
	} catch(err){
		return next(err)
	}
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
const createComment = async(req,res,next) => {
	try{
		const postId = req.params.postId;
		const input = req.body;
		const author = res.locals.user.username
		const comment = await postServices.createComment(postId, input, author);
		return res.json({ comment });
	} catch(err){
		return next(err)
	}
};

/** Handle put request to edit a particular comment.
 * Request Data - 
 * 		params.commentId
 * 		body:{body:<string>}
 * Return response with json body.
 * 		{
 * 			"comment": {
				"id": <num>,
				"body": <string>,
				"postid": <num>,
				"author": <string>
			}
 * 		}
 */
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

/** Handle delete request to remove a comment.
 * Request Data - 
 * 		params.commentId
 * Return response status 204 with empty body.
 */
// const deleteComment = async(req,res,next) => {
// 	try{
// 		const commentId = req.params.commentId;
// 		await postServices.deleteComment(commentId);
// 		return res.status(204).send();
// 	} catch(err){
// 		return next(err)
// 	}
// };


module.exports = {
	getEventPosts,
	createPost,
	editPost,
	createComment,
	editComment,
	deleteComment
}