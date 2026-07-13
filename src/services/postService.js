import pool from "../config/db.js"

import { generateSlug } from "../utils/slug.js"
import { calculateReadingTime } from "../utils/readingTime.js";
import { extractTags } from "../utils/extractTags.js"

import AppError from "../utils/AppError.js"

export const createPost = async (postData, userId) => {
    const {title, markdownBody} = postData;

    const slug = generateSlug(title);
    const readingTimeMinutes = calculateReadingTime(markdownBody);
    const tags = extractTags(markdownBody);
    
    const existingPost = await pool.query(
        `SELECT id
         FROM posts
         WHERE slug = $1`,
        [slug]
    );

    if (existingPost.rows.length > 0) {
        throw new AppError("A post with this title already exists", 409);
    }

    const result = await pool.query(
        `INSERT INTO posts
        (user_id, title, slug, markdown_body, tags, reading_time_minutes)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [userId, title, slug, markdownBody, tags, readingTimeMinutes]
    )
    return result.rows[0];
}




export const getAllPosts = async (query) => {
    const {search = "", tag, page = 1, limit = 10} = query;
    const currentPage = Number(page);
    const pageSize = Number(limit);
    const offset = (currentPage - 1) * pageSize;
    let sql = 
    `
        SELECT id, title, slug, tags, reading_time_minutes, created_at
        FROM posts
        WHERE 1=1
    `;
    const values = [];
    if(search){
        values.push(`%${search}%`);
        sql += `
            AND (title ILIKE $${values.length} 
            OR markdown_body ILIKE $${values.length})
        `
    }
    if(tag){
        values.push(tag.toLowerCase());
        sql += `
            AND $${values.length} = ANY(tags)
        `
    }
    values.push(pageSize);
    sql += `
        ORDER BY created_at DESC 
        LIMIT $${values.length}
    `
    values.push(offset);
    sql += `
        OFFSET $${values.length}
    `

    const result = await pool.query(sql, values);
    return result.rows;
    
}


export const getPostBySlug = async (slug) => {
    const result = await pool.query(
        `SELECT *
        FROM posts
        WHERE slug = $1`,
        [slug]
    )
    return result.rows[0];
}


export const updatePost = async (slug, userId, postData) => {
    const {title, markdownBody} = postData;
    const newSlug = generateSlug(title);
    const readingTimeMinutes = calculateReadingTime(markdownBody);
    const tags = extractTags(markdownBody);
    const result = await pool.query(
        `UPDATE posts
         SET
            title = $1,
            slug = $2,
            markdown_body = $3,
            tags = $4,
            reading_time_minutes = $5,
            updated_at = CURRENT_TIMESTAMP
         WHERE slug = $6
         AND user_id = $7
         RETURNING *`,
        [title, newSlug, markdownBody, tags, readingTimeMinutes, slug, userId]
    );
    return result.rows[0];
}


export const deletePost = async (slug, userId) => {
    const result = await pool.query(
        `DELETE FROM posts
         WHERE slug = $1
         AND user_id = $2
         RETURNING *`,
        [
            slug,
            userId
        ]
    );
    return result.rows[0];
}