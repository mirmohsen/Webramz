import { createUser, existUser } from '../model/user.js';

export const signup = async (req, res) => {
	const { email, username, password } = req.body;

	try {
		const userExists = await existUser(email);

		if (userExists) {
			return res
				.status(400)
				.json({ message: 'User with this email already exists' });
		}

		const user = await createUser(email, username, password);
		return res
			.status(201)
			.json({ message: 'User created successfully', userId: user._id });
	} catch (err) {
		console.error('Signup error:', err);
		return res.status(500).json({ message: 'Internal server error' });
	}
};
