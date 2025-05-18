import mongoose from 'mongoose';

import { mongo } from './config.js';

const { url, option } = mongo;

mongoose.connect(url, option);

mongoose.connection.on('error', (err) => {
	console.log(`====>> mongodb connection error: ${err}`);
});

mongoose.connection.once('open', () => {
	console.log(`====>> mongodb successfully connected!`);
});
