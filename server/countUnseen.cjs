const fs = require('fs');
const path = require('path');

module.exports = (req, res, next) => {
	const dbPath = path.join(__dirname, 'db.json');

	fs.readFile(dbPath, 'utf8', (err, data) => {
		if (err) {
			console.error('Error reading db.json:', err);
			res.header('X-Unseen-Count', '0');
			return next();
		}

		let db;
		try {
			db = JSON.parse(data);
		} catch (parseErr) {
			console.error('Error parsing db.json:', parseErr);
			res.header('X-Unseen-Count', '0');
			return next();
		}

		const notifications = db.notifications || [];
		const unseenCount = notifications.filter(
			(notification) => !notification.seen
		).length;

		// Get any existing exposed headers.
		const existingExposedHeaders =
			res.getHeader('Access-Control-Expose-Headers') || '';
		const headersToExpose = ['X-Unseen-Count'].concat(
			existingExposedHeaders.split(',')
		);

		// Set the custom header and also expose it for CORS.
		res.header('Access-Control-Expose-Headers', headersToExpose.join(','));
		res.header('X-Unseen-Count', unseenCount.toString());

		// Continue to the next middleware in the chain.
		next();
	});
};
