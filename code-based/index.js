//! 1 - JWT Auth Middleware
require('dotenv').config();
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;

function authMiddleware(req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'No token provided' });
	}
	const token = authHeader.split(' ')[1];
	try {
		const decoded = jwt.verify(token, secretKey);
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid token' });
	}
}

//-> 1b - Middleware with Token Renewal

function authMiddlewareWithAutoRenew(req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'No token provided' });
	}
	const token = authHeader.split(' ')[1];
	try {
		const decoded = jwt.verify(token, secretKey);
		req.user = decoded;
		const currentTime = Math.floor(Date.now() / 1000);
		const timeLeft = decoded.exp - currentTime;
		if (timeLeft < 300) {
			const newToken = jwt.sign({ id: decoded.id }, secretKey, {
				expiresIn: '15m',
			});
			res.setHeader('x-new-token', newToken);
		}
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
}

//! 2 - Mongoose Populate with Optimization
// User.find().populate('profile').lean().exec();
const getUsersWithProfiles = async () => {
	return User.find({}, null, { lean: true }).populate('profile', '-__v');
};

//-> 2b - Indexing MongoDB Collections

// db.users.createIndex({ 'profile': 1 })
// Depending on the structure, we add an index to the foreign key reference field in the user or profile.

	//! 3 - Express Route with Async/Await and Error Handling
	const express = require('express');
	const router = express.Router();

	router.get('/user/:id', async (req, res) => {
		try {
			const user = await User.findById(req.params.id);
			if (!user) return res.status(404).json({ message: 'User not found' });
			res.json(user);
		} catch (error) {
			res.status(500).json({ message: 'Internal Server Error' });
		}
	});

	//-> 3b - Refactored Route with Middleware

	const asyncHandler = (fn) => (req, res, next) =>
		Promise.resolve(fn(req, res, next)).catch(next);

	router.get(
		'/user/:id',
		asyncHandler(async (req, res) => {
			const user = await User.findById(req.params.id);
			if (!user) return res.status(404).json({ message: 'User not found' });
			res.json(user);
		})
	);
