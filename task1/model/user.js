// models/User.js
import mongoose from 'mongoose';
import { hashPassword } from '../utils/encryption.js';

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export const user = mongoose.model('User', userSchema);

export const existUser = async (email) => {
	const foundUser = await user.findOne({ email });
	return !!foundUser;
};

export const createUser = async (email, username, password) => {
	const hashed = await hashPassword(password);
	const create = await user.create({ email, username, password: hashed });
	return create;
};


