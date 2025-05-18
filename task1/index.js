import express from 'express';
import env from 'dotenv';
env.config({
	path: '.env',
});
import routerV1 from './router/v1/router.js';

import './model/setup/mongodb.js';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use('/api', routerV1);

app.listen(port, () => {
	console.log(`====>> server up on port:${port}`);
});
