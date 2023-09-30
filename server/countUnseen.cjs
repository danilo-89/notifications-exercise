const fs = require('fs');
const path = require('path');

module.exports = (req, res, next) => {
	const dbPath = path.join(__dirname, 'db.json'); // Adjust the path as needed

	fs.readFile(dbPath, 'utf8', (err, data) => {
		if (err) {
			console.error('Error reading db.json:', err);
			res.header('Access-Control-Expose-Headers', 'X-Total, X-Unseen');
			res.header('X-Total', '0');
			res.header('X-Unseen', '0');
			return next();
		}

		let db;
		try {
			db = JSON.parse(data);
		} catch (parseErr) {
			console.error('Error parsing db.json:', parseErr);
			res.header('Access-Control-Expose-Headers', 'X-Total, X-Unseen');
			res.header('X-Total', '0');
			res.header('X-Unseen', '0');
			return next();
		}

		const notifications = db.notifications || [];
		const unseenCount = notifications.filter(
			(notification) => !notification.seen
		).length;

		// console.log('Setting Headers: X-Unseen-Count =', unseenCount.toString()); // Debug statement
		res.header('Access-Control-Expose-Headers', 'X-Total, X-Unseen');
		res.header('X-Total', notifications.length.toString());
		res.header('X-Unseen', unseenCount.toString());
		next();
	});
};
