const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./server/db.json');
const middlewares = jsonServer.defaults();
const customMiddleware = require('./server/countUnseen.cjs'); // Adjust the path if needed

// Use Custom Middleware
server.use(middlewares);
server.use(customMiddleware);

// Add this middleware to adjust CORS settings
router.render = (req, res) => {
	let headersToExpose = ['X-Unseen-Count'];
	let currentExposedHeaders = res.getHeader('Access-Control-Expose-Headers');

	if (currentExposedHeaders) {
		res.header(
			'Access-Control-Expose-Headers',
			headersToExpose.concat(currentExposedHeaders.split(',')).join(',')
		);
	} else {
		res.header('Access-Control-Expose-Headers', headersToExpose.join(','));
	}

	res.send(res.locals.data);
};

server.use(router);

const PORT = 3001;
server.listen(PORT, () => {
	console.log('JSON Server is running on port ' + PORT);
});
