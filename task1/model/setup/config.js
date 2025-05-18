import env from 'dotenv';
env.config({
	path: '.env',
});

const { URL_MONGODB } = process.env;

export const mongo = {
	url: URL_MONGODB,
	Option: {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	},
};
