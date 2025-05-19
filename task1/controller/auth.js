import { createUser, existUser, getUserByEmail } from '../model/user.js';
import { comparePassword } from '../utils/encryption.js';
import { generateToken } from '../utils/jwt.js';
import { userSignupSchema, userSigninSchema } from '../utils/validation.js';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 format: password
 *                 example: strongPassword123
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 userId:
 *                   type: string
 *                   example: 609e129e7dbf3c3b7c123456
 *       400:
 *         description: Validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User with this email already exists
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Sign in an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: strongPassword123
 *     responses:
 *       200:
 *         description: Signin successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Signin successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 userId:
 *                   type: string
 *                   example: 609e129e7dbf3c3b7c123456
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email is required"
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *       500:
 *         description: Internal server error
 */
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

		const token = generateToken({ userId: userExist._id });

		return res
			.status(200)
			.json({ message: 'Signin successful', token, userId: userExist._id });
	} catch (err) {
		console.error('Signin error:', err);
		return res.status(500).json({ message: 'Internal server error' });
	}
};
