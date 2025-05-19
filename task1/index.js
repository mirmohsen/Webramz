import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import env from 'dotenv';
env.config();

import routerV1 from './router/v1/router.js';

import './model/setup/mongodb.js';

const app = express();
const port = process.env.PORT || 8080;
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Task Webramz',
			version: '1.0.0',
			description: '',
		},
	},
	apis: ['./controller/*.js'],
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(express.json());
app.use('/api', routerV1);

app.listen(port, () => {
	console.log(`====>> server up on port:${port}`);
});
