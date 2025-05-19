import { processUpload } from '../model/mediaFile.js';
import { mediaMetadataSchema } from '../utils/validation.js';

/**
 * @swagger
 * /api/uploadFile:
 *   post:
 *     summary: Upload a media file with metadata
 *     tags:
 *       - Media Files
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the media
 *               description:
 *                 type: string
 *                 description: Description of the media
 *               alignment:
 *                 type: string
 *                 enum: [Landscape, Portrait, Other]
 *                 description: Alignment of the media
 *               resolution:
 *                 type: string
 *                 enum: [HD, FullHD, 4K, 8K, Other]
 *                 description: Resolution of the media
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Media file to upload (image or video)
 *             required:
 *               - title
 *               - alignment
 *               - resolution
 *               - file
 *     responses:
 *       201:
 *         description: Successfully uploaded media file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109ca"
 *                 title:
 *                   type: string
 *                   example: "My Video"
 *                 description:
 *                   type: string
 *                   example: "A sample description"
 *                 alignment:
 *                   type: string
 *                   example: "Landscape"
 *                 resolution:
 *                   type: string
 *                   example: "4K"
 *                 onlineId:
 *                   type: string
 *                   example: "abc123xyz"
 *                 url:
 *                   type: string
 *                   example: "http://example.com/media/abc123.mp4"
 *                 thumbUrl:
 *                   type: string
 *                   example: "http://example.com/media/thumb-abc123.png"
 *       400:
 *         description: Bad request, invalid metadata or no file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No file uploaded"
 *       500:
 *         description: Server error during upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Upload failed"
 */
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
