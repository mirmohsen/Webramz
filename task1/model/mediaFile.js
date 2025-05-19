import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import path from 'path';
import { validateVideoDuration } from '../utils/validation.js';
import {
	generateImageThumbnail,
	generateVideoThumbnail,
} from '../utils/validation.js';

const mediaFileSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String },
		alignment: {
			type: String,
			enum: ['Landscape', 'Portrait', 'Other'],
			required: true,
		},
		resolution: {
			type: String,
			enum: ['HD', 'FullHD', '4K', '8K', 'Other'],
			required: true,
		},
		fileType: {
			type: String,
			enum: ['image', 'video'],
			required: true,
		},
		url: { type: String, required: true },
		thumbUrl: { type: String, required: true },
		onlineId: { type: String, required: true, unique: true },
		uploadedDate: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

mediaFileSchema.index({ title: 'text', onlineId: 'text' });

mediaFileSchema.statics.searchFiles = async function (filters) {
	const {
		alignment,
		resolution,
		fileType,
		period,
		search,
		page = 1,
		limit = 10,
		sortBy = 'uploadedDate',
		sortOrder = 'desc',
	} = filters;

	const query = {};

	if (alignment) query.alignment = alignment;
	if (resolution) query.resolution = resolution;
	if (fileType) query.fileType = fileType;

	if (period) {
		const now = new Date();
		const periods = {
			'1week': 7,
			'2weeks': 14,
			'1month': 30,
			'6months': 182,
			'1year': 365,
		};
		const days = periods[period];
		if (days) {
			const fromDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
			query.uploadedDate = { $gte: fromDate };
		}
	}

	if (search) {
		query.$text = { $search: search };
	}

	const skip = (parseInt(page) - 1) * parseInt(limit);
	const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

	const [totalCount, files] = await Promise.all([
		this.countDocuments(query),
		this.find(query)
			.sort(sort)
			.skip(skip)
			.limit(parseInt(limit))
			.select(
				'onlineId title url thumbUrl fileType alignment resolution uploadedDate'
			),
	]);

	return { totalCount, files };
};

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
