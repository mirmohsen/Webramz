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
