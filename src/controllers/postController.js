import asyncHandler from "../utils/asyncHandler.js";

import { createPost, getAllPosts, getPostBySlug, updatePost, deletePost } from "../services/postService.js";

import AppError from "../utils/AppError.js";

export const create = asyncHandler(async (req, res) => {
    const post = await createPost(req.body, req.user.id);
    return res.status(201).json({
        success: true,
        data: post
    });  
})

export const getAll = asyncHandler(async (req, res) => {
    const posts = await getAllPosts(req.query);
    return res.status(200).json({
        success: true,
        data: posts
    }); 
})

export const getOne = asyncHandler(async (req, res) => {
    const post = await getPostBySlug(req.params.slug);
    if(!post){
        throw new AppError("Post Not Found..", 404)
    }
    return res.status(200).json({
        success: true,
        data: post
    }); 
})


export const update = asyncHandler(async (req, res) => {
    const post = await updatePost(req.params.slug, req.user.id, req.body);
    if(!post){
        throw new AppError("Post Not Found..", 404)
    }
    return res.status(200).json({
        success: true,
        data: post
    }); 
})


export const remove = asyncHandler(async (req, res) => {
    const post = await deletePost(req.params.slug, req.user.id);
    if(!post){
        throw new AppError("Post Not Found..", 404)
    }
    return res.status(200).json({
        success: true,
        message: "Post deleted successfully"
    }); 
})