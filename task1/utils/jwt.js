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

export const authenticate = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader?.startsWith('Bearer '))
		return res.status(401).json({ message: 'Unauthorized: No token provided' });

	const token = authHeader.split(' ')[1];
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Unauthorized: Invalid token' });
	}
};
