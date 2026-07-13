import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { registerUser, loginUser, refreshAccessToken, logoutUser } from "../services/authService.js";
import AppError from "../utils/AppError.js";


export const register = asyncHandler(async (req, res) => {
    const user = await registerUser(req.body);
    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user
    })
})


export const login = asyncHandler(async (req, res) => {
    const {user, accessToken, refreshToken} = await loginUser(req.body);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken,
        user
    })
})

export const refresh = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = await refreshAccessToken(refreshToken);

    return res.status(200).json({
        success: true,
        accessToken
    })
})


export const logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        throw new AppError("Refresh token missing", 401);
    }

    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    await logoutUser(payload.id);

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    });

    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
})