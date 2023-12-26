"use strict";
const Comment = require('../models/comments.model')


/** 
 * Get all comments for an event
 * @param {number} eventId 
 * @returns {Array} comments
 */
const getEventComments = async(eventId) => {
	const comments = await Comment.getForEvent(eventId);
	return comments
};

/**
 * Create a new comment associated with a event
 * @param {number} eventId 
 * @param {Object} input 
 * @property {string} title
 * @property {string} body
 * @param {string} author 
 * @returns {Array} comments - updated array of comments for event.
 */
const createComment = async(eventId, comment, author) => {
	await Comment.create(eventId, comment, author);
	const comments = await getEventComments(eventId)
	return comments;
};

/**
 * Delete a comment
 * @param {number} postId 
 * @returns {undefined}
 */
const deleteComment = async(postId) => {
	await Comment.delete(postId);
	return
};

module.exports = {
	getEventComments,
	createComment,
	deleteComment
}

/**
//  * edit post
//  * @param {number} postId 
//  * @param {Object} input
//  * @property {string} title
//  * @property {string} body
//  * @returns {Post}
//  */
// const editPost = async(postId, input) => {
// 	const post = await Post.edit(postId, input);
// 	if(!post) throw new NotFoundError()
// 	return post;

// };

// /**
//  * Create new comment
//  * @param {number} postId 
//  * @param {Object} input 
//  * @property {string} body
//  * @param {string} author 
//  * @returns {Comment}
//  */
// const createComment = async(postId, input, author) => {
// 	const body = input.body;
// 	const comment = await Comment.create(postId, author, body);
// 	return comment
// };

// /**
//  * Edit comment.
//  * @param {number} commentId 
//  * @param {Object} input 
//  * @property {string} body
//  * @returns {Comment}
//  */
// const editComment = async(commentId, input) => {
// 	const body = input.body;

// 	const comment = await Comment.edit(commentId, body)
// 	return comment
// };
// /**
//  * Delete comment
//  * @param {number} commentId 
//  * @returns {undefined}
//  */
// const deleteComment = async(commentId) => {
// 	const comment = await Comment.delete(commentId)
// 	if(!comment) throw new NotFoundError()
// 	return
// };