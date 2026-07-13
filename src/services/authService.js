import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import pool from "../config/db.js";
import AppError from "../utils/AppError.js";

import { generateAccessToken, generateRefreshToken } from "../utils/token.js"


const SALT_ROUNDS = 10;

export const registerUser = async (userData) => {
    const {name, email, password} = userData;

    const existingUser = await pool.query(
        `SELECT id
        FROM users
        WHERE email = $1`,
        [email]   
    )
    if(existingUser.rows.length > 0){
        throw new AppError("Email already registered", 409)
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    const result = await pool.query(
        `INSERT INTO users
        (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, role, created_at`,
        [name, email, hashedPassword]
    )
    return result.rows[0];
}




export const loginUser = async ({email, password}) => {
    const result = await pool.query(
        `SELECT *
        FROM users
        WHERE email = $1`,
        [email]   
    )
    if(result.rows.length === 0){
        throw new AppError("Invalid email or password", 401)
    }
    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        throw new AppError("Invalid email or password", 401)
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    await pool.query(
        `UPDATE users
        SET refresh_token = $1
        WHERE id = $2`,
        [refreshToken, user.id]
    )

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
        },
        accessToken,
        refreshToken
    }
}



export const refreshAccessToken = async (refreshToken) => {
    if(!refreshToken){
        throw new AppError("Refresh token missing", 401)
    }
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

    const result = await pool.query(
        `SELECT id, name, email, role, refresh_token
        FROM users
        WHERE id = $1`,
        [payload.id]
    )
    if(result.rows.length === 0){
        throw new AppError("User not found", 401)
    }
    const user = result.rows[0];
    if(user.refresh_token !== refreshToken){
        throw new AppError("Invalid refresh token", 401)
    }
    return generateAccessToken(user);  
}



export const logoutUser = async (userId) => {
    await pool.query(
        `UPDATE users
        SET refresh_token = NULL
        WHERE id = $1`,
        [userId]
    );
}