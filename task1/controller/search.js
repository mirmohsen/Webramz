import File from '../model/mediaFile.js';

export const searchFiles = async (req, res) => {
	try {
		const results = await File.searchFiles(req.query);
		res.json(results);
	} catch (err) {
		console.error('Search error:', err);
		res.status(500).json({ message: 'Server error' });
	}
};
