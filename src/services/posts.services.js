"use strict";

const { NotFoundError } = require('../expressError');
const Post = require('../models/posts.model');
const Comment = require('../models/comments.model')

/**
 * Post object
 * @typedef {Object} EventPosts
 * @property {number} id
 * @property {string} title
 * @property {string} body
 * @property {number} eventId
 * @property {string} postAuthor - username of post's author
 * @property {Array.<Comment>} comments
 */

/**
 * Comment object
 * @typedef {Object} PostComments
 * @property {number} id
 * @property {string} body
 * @property {number} postId
 * @property {string} author - username of comment author
 */

/**
 * Get posts for a event
 * @param {number} eventId 
 * @returns {Array.<Post>} posts
 */
const getEventPosts = async(eventId) => {
	const posts = await Post.getForEvent(eventId);

	return posts
};

/**
 * Create a new post associated with a event
 * @param {number} eventId 
 * @param {Object} input 
 * @property {string} title
 * @property {string} body
 * @param {*} author 
 * @returns {Post}
 */
const createPost = async(eventId, input, author) => {
	const title = input.title;
	const body = input.body;
	const post = 
		await Post.create(title, body, eventId, author);
	return post;
};

/**
 * edit post
 * @param {number} postId 
 * @param {Object} input
 * @property {string} title
 * @property {string} body
 * @returns {Post}
 */
const editPost = async(postId, input) => {
	const post = await Post.edit(postId, input);
	if(!post) throw new NotFoundError()
	return post;

};
/**
 * Delete post
 * @param {number} postId 
 * @returns {undefined}
 */
const deletePost = async(postId) => {
	const post = await Post.delete(postId);
	if(!post) throw new NotFoundError();
	return
};

/**
 * Create new comment
 * @param {number} postId 
 * @param {Object} input 
 * @property {string} body
 * @param {string} author 
 * @returns {Comment}
 */
const createComment = async(postId, input, author) => {
	const body = input.body;
	const comment = await Comment.create(postId, author, body);
	return comment
};

/**
 * Edit comment.
 * @param {number} commentId 
 * @param {Object} input 
 * @property {string} body
 * @returns {Comment}
 */
const editComment = async(commentId, input) => {
	const body = input.body;

	const comment = await Comment.edit(commentId, body)
	return comment
};
/**
 * Delete comment
 * @param {number} commentId 
 * @returns {undefined}
 */
const deleteComment = async(commentId) => {
	const comment = await Comment.delete(commentId)
	if(!comment) throw new NotFoundError()
	return
};

module.exports = {
	getEventPosts,
	createPost,
	editPost,
	deletePost,
	createComment,
	editComment,
	deleteComment
}