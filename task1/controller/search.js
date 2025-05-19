import File from '../model/mediaFile.js';

/**
 * @swagger
 * /api/searchFiles:
 *   get:
 *     summary: Search media files with filters
 *     tags:
 *       - Media Files
 *     parameters:
 *       - in: query
 *         name: alignment
 *         schema:
 *           type: string
 *           enum: [Landscape, Portrait, Other]
 *         description: Filter by alignment
 *       - in: query
 *         name: resolution
 *         schema:
 *           type: string
 *           enum: [HD, FullHD, 4K, 8K, Other]
 *         description: Filter by resolution
 *       - in: query
 *         name: fileType
 *         schema:
 *           type: string
 *           enum: [image, video]
 *         description: Filter by file type
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [1week, 2weeks, 1month, 6months, 1year]
 *         description: Filter files uploaded within this period
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Text search on title and onlineId
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: uploadedDate
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of media files matching filters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                   example: 100
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       onlineId:
 *                         type: string
 *                         example: "abc123xyz"
 *                       title:
 *                         type: string
 *                         example: "Beautiful Landscape"
 *                       url:
 *                         type: string
 *                         example: "http://example.com/media/abc123.jpg"
 *                       thumbUrl:
 *                         type: string
 *                         example: "http://example.com/media/thumb-abc123.png"
 *                       fileType:
 *                         type: string
 *                         example: "image"
 *                       alignment:
 *                         type: string
 *                         example: "Landscape"
 *                       resolution:
 *                         type: string
 *                         example: "4K"
 *                       uploadedDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-19T12:34:56Z"
 *       500:
 *         description: Server error
 */
export const searchFiles = async (req, res) => {
	try {
		const results = await File.searchFiles(req.query);
		res.json(results);
	} catch (err) {
		console.error('Search error:', err);
		res.status(500).json({ message: 'Server error' });
	}
};
