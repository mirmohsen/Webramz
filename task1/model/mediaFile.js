import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import path from 'path';
import { validateVideoDuration } from '../utils/validation.js';
import {
	generateImageThumbnail,
	generateVideoThumbnail,
} from '../utils/validation.js';

const mediaFileSchema = new mongoose.Schema({
	title: String,
	description: String,
	alignment: {
		type: String,
		enum: ['Landscape', 'Portrait', 'Other'],
	},
	resolution: {
		type: String,
		enum: ['HD', 'FullHD', '4K', '8K', 'Other'],
	},
	onlineId: {
		type: String,
		unique: true,
	},
	url: String,
	thumbUrl: String,
	fileType: {
		type: String,
		enum: ['image', 'video'],
	},
	uploadedDate: {
		type: Date,
		default: Date.now,
	},
});

const MediaFile = mongoose.model('MediaFile', mediaFileSchema);

export const processUpload = async (file, metadata) => {
	const { title, description, alignment, resolution } = metadata;
	const ext = path.extname(file.filename);
	const fileType = file.mimetype.startsWith('image') ? 'image' : 'video';

	const filePath = file.path;
	const thumbName = 'thumb-' + file.filename + '.png';
	const thumbPath = path.join('thumbs', thumbName);

	if (fileType === 'video') await validateVideoDuration(filePath);
	if (fileType === 'image') await generateImageThumbnail(filePath, thumbPath);
	else await generateVideoThumbnail(filePath, thumbPath);

	const media = await MediaFile.create({
		title,
		description,
		alignment,
		resolution,
		onlineId: nanoid(),
		url: filePath,
		thumbUrl: thumbPath,
		fileType,
	});

	return media;
};

export default MediaFile;
