import jwt from 'jsonwebtoken';
import {configDotenv} from 'dotenv';
import User from "../models/User.model.js";
configDotenv();
const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header required' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env._JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: 'Invalid token' });
        req.user= {
            role:user?.role,
            id:user?._id,
        }
        console.log(req.user)
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
export default authenticateJWT;