import jwt from "jsonwebtoken"
import AppError from "../utils/AppError.js"

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return next (new AppError("Access token missing", 401))
    }

    const token = authHeader.split(" ")[1];
    try{
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = payload;
        next()
    } catch(err){
        next(new AppError("Invalid or expired access token", 401))
    }
}

export default authenticate;