"use strict";

const { BadRequestError, NotFoundError } = require('../expressError');
const Post = require('../models/posts.model');
const Comment = require('../models/comments.model')
const gatheringServices = require("../services/gatherings.services")

const getGatheringPosts = async(gatheringId) => {
	const posts = await Post.getForGathering(gatheringId);

	return posts
};

const createPost = async(gatheringId, input, author) => {
	const title = input.title;
	const body = input.body;
	const post = 
		await Post.create(title, body, gatheringId, author);
	return post;
};

const editPost = async(postId, input) => {
	const post = await Post.edit(postId, input);
	if(!post) throw new NotFoundError
	return post;

};

const deletePost = async(postId) => {
	const post = await Post.delete(postId);
	return post;
};

const createComment = async(postId, input, author) => {
	const body = input.body;
	const comment = await Comment.create(postId, author, body);
	return comment
};

const editComment = async(commentId, input) => {
	const body = input.body;

	const comment = await Comment.edit(commentId, body)
	return comment
};

const deleteComment = async(commentId) => {
	const comment = await Comment.delete(commentId)
	return comment
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