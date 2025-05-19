import File from './mediaFile.js';

export const searchFiles = async (req, res) => {
	try {
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
		} = req.query;

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
			File.countDocuments(query),
			File.find(query)
				.sort(sort)
				.skip(skip)
				.limit(parseInt(limit))
				.select(
					'onlineId title url thumbUrl fileType alignment resolution uploadedDate'
				),
		]);

		res.json({ totalCount, files });
	} catch (err) {
		console.error('Search error:', err);
		res.status(500).json({ message: 'Server error' });
	}
};
