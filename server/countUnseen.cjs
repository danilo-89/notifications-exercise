const fs = require('fs');
const path = require('path');

module.exports = (req, res, next) => {
	const dbPath = path.join(__dirname, 'db.json'); // Adjust the path as needed

	fs.readFile(dbPath, 'utf8', (err, data) => {
		if (err) {
			console.error('Error reading db.json:', err);
			// res.header('Access-Control-Expose-Headers', 'X-Unseen-Count');
			res.header('Link', '0; rel="unseenCount"');
			return next();
		}

		let db;
		try {
			db = JSON.parse(data);
		} catch (parseErr) {
			console.error('Error parsing db.json:', parseErr);
			// res.header('Access-Control-Expose-Headers', 'X-Unseen-Count');
			res.header('Link', '0; rel="unseenCount"');
			return next();
		}

		const notifications = db.notifications || [];
		const unseenCount = notifications.filter(
			(notification) => !notification.seen
		).length;

		// console.log('Setting Headers: X-Unseen-Count =', unseenCount.toString()); // Debug statement
		// res.header('Access-Control-Expose-Headers', 'X-Unseen-Count');
		res.header('Link', `${unseenCount.toString()}; rel="unseenCount"`);
		next();
	});
};
