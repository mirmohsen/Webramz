import multer from 'multer';

const storage = multer.diskStorage({
	destination: 'uploads/',
	filename: (req, file, cb) => {
		const ext = file.originalname.split('.').pop();
		const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, `${unique}.${ext}`);
	},
});

const fileFilter = (req, file, cb) => {
	const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4'];
	if (allowedTypes.includes(file.mimetype)) cb(null, true);
	else cb(new Error('Invalid file type'), false);
};

export const upload = multer({
	storage,
	limits: { fileSize: 100 * 1024 * 1024 },
	fileFilter,
});
