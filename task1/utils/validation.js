import Joi from 'joi';
import ffmpeg from 'fluent-ffmpeg';
import sharp from 'sharp';
import path from 'path';

export const isValidEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export const userSignupSchema = Joi.object({
	email: Joi.string().email().lowercase().trim().required(),
	username: Joi.string().min(3).max(30).trim().required(),
	password: Joi.string().min(6).max(128).required(),
});

export const userSigninSchema = Joi.object({
	email: Joi.string().email().lowercase().trim().required(),
	password: Joi.string().min(6).max(128).required(),
});

export const mediaMetadataSchema = Joi.object({
	title: Joi.string().required(),
	description: Joi.string().required(),
	alignment: Joi.string().valid('Landscape', 'Portrait', 'Other').required(),
	resolution: Joi.string()
		.valid('HD', 'FullHD', '4K', '8K', 'Other')
		.required(),
});

export const validateVideoDuration = (filePath) => {
	return new Promise((resolve, reject) => {
		ffmpeg.ffprobe(filePath, (err, metadata) => {
			if (err) return reject(err);
			const duration = metadata.format.duration;
			if (duration > 10)
				return reject(new Error('Video longer than 10 seconds'));
			resolve(true);
		});
	});
};

export const generateImageThumbnail = async (filePath, thumbPath) => {
	return await sharp(filePath).resize(100, 100).toFile(thumbPath);
};

export const generateVideoThumbnail = (filePath, thumbPath) => {
	return new Promise((resolve, reject) => {
		ffmpeg(filePath)
			.screenshots({
				count: 1,
				folder: path.dirname(thumbPath),
				filename: path.basename(thumbPath),
				size: '100x100',
			})
			.on('end', resolve)
			.on('error', reject);
	});
};
