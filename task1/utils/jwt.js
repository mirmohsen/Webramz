import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = '7d';

export const generateToken = (payload) => {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
};

export const verifyToken = (token) => {
	return jwt.verify(token, JWT_SECRET);
};
