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

//! 4 - Multer Config for Image Uploads
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({
	storage,
	limits: { fileSize: 1 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		const filetypes = /jpeg|jpg|png/;
		const extname = filetypes.test(
			path.extname(file.originalname).toLowerCase()
		);
		const mimetype = filetypes.test(file.mimetype);
		if (extname && mimetype) {
			return cb(null, true);
		} else {
			cb(new Error('Only JPEG and PNG files are allowed'));
		}
	},
});

//-> 4b - Handle Multiple Files
router.post('/upload', upload.array('images', 10), (req, res) => {
	const files = req.files;
	if (!files) return res.status(400).send('No files uploaded');
	files.forEach((file) => {
		const fs = require('fs');
		const path = require('path');
		const uploadDir = path.join(__dirname, 'uploads');

		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir);
		}

		const filename = `${Date.now()}-${file.originalname}`;
		const filepath = path.join(uploadDir, filename);

		fs.writeFileSync(filepath, file.buffer);
	});
	res.send('Files uploaded successfully');
});

//! 5 - Optimized Query to Populate Orders with Users
const getOrdersWithUsers = async () => {
	return await Order.find().populate('user', 'name email -_id').lean();
};

//-> 5b - Index for Optimization
db.orders.createIndex({ user: 1 });

//! 6 - Multer Config for Up to 5 Image Uploads
const uploadImages = multer({
	storage,
	limits: { fileSize: 1 * 1024 * 1024 }, //->  Limit file size to 1MB
	fileFilter: (req, file, cb) => {
		const filetypes = /jpeg|jpg|png/;
		const extname = filetypes.test(
			path.extname(file.originalname).toLowerCase()
		);
		const mimetype = filetypes.test(file.mimetype);
		if (extname && mimetype) {
			return cb(null, true);
		} else {
			cb(new Error('Only JPEG and PNG files are allowed'));
		}
	},
}).array('images', 5); //-> Limit to 5 files

router.post('/multi-upload', (req, res) => {
	uploadImages(req, res, (err) => {
		if (err) return res.status(400).json({ message: err.message });
		res.send('Up to 5 image files uploaded');
	});
});
