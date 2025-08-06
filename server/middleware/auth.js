import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    const token = req.headers.authorization;
    if(!token){
        return res.json({success: false, message: "not authorized"})
    }
    try {
        //need to handle the "Bearer " prefix
        let actualToken = token;
        if (token.startsWith('Bearer ')) {
            actualToken = token.split(' ')[1];
        }
        
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
        
        if(!decoded){
            return res.json({success: false, message: "not authorized"})
        }
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        console.log("Auth error:", error.message); // Add this for debugging
        return res.json({success: false, message: "not authorized"})
    }
}