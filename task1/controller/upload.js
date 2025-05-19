import { processUpload } from '../model/mediaFile.js';
import { mediaMetadataSchema } from '../utils/validation.js';

export const uploadFile = async (req, res) => {
	try {
		const { error } = mediaMetadataSchema.validate(req.body);
		if (error)
			return res.status(400).json({ message: error.details[0].message });

		const file = req.file;
		if (!file) return res.status(400).json({ message: 'No file uploaded' });

		const result = await processUpload(file, req.body);

		return res.status(201).json({
			id: result._id,
			title: result.title,
			description: result.description,
			alignment: result.alignment,
			resolution: result.resolution,
			onlineId: result.onlineId,
			url: result.url,
			thumbUrl: result.thumbUrl,
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: err.message || 'Upload failed' });
	}
};
