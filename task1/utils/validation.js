import Joi from 'joi';

export const isValidEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export const userSignupSchema = Joi.object({
	email: Joi.string().email().lowercase().trim().required(),
	username: Joi.string().min(3).max(30).trim().required(),
	password: Joi.string().min(6).max(128).required(),
});

export const userSigninSchema = Joi.object({
	email: Joi.string().email().lowercase().trim().required(),
	password: Joi.string().min(6).max(128).required(),
});
