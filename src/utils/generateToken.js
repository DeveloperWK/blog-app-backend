import { configDotenv } from 'dotenv';
import jwt from 'jsonwebtoken';
configDotenv();
const JWT_SECRET = process.env._JWT_SECRET;
const generateToken = (user) => {
    const payload = {
        id: user._id,
    };
    return jwt.sign(payload, JWT_SECRET);
};
export default generateToken;