import { createUser, existUser, getUserByEmail } from '../model/user.js';
import { comparePassword } from '../utils/encryption.js';
import { userSignupSchema, userSigninSchema } from '../utils/validation.js';

export const signup = async (req, res) => {
	const { email, username, password } = req.body;

	const { error } = userSignupSchema.validate({ email, username, password });
	if (error) {
		return res.status(400).json({ message: error.details[0].message });
	}

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

export const signin = async (req, res) => {
	const { email, password } = req.body;

	const { error } = userSigninSchema.validate({ email, password });
	if (error) {
		return res.status(400).json({ message: error.details[0].message });
	}

	try {
		let userExist = await getUserByEmail(email);
		if (!userExist) {
			return res.status(401).json({ message: 'Invalid email or password' });
		}

		const isMatch = await comparePassword(password, userExist.password);
		if (!isMatch) {
			return res.status(401).json({ message: 'Invalid email or password' });
		}

		return res
			.status(200)
			.json({ message: 'Signin successful', userId: userExist._id });
	} catch (err) {
		console.error('Signin error:', err);
		return res.status(500).json({ message: 'Internal server error' });
	}
};
