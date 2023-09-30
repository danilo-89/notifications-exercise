const fs = require('fs');
const path = require('path');
const z = require('zod');

const postNotificationSchema = z.object({
	body: z.string(),
	user: z.string().optional(),
});

module.exports = (req, res, next) => {
	const dbPath = path.join(__dirname, 'db.json'); // Adjust the path as needed

	// console.log({ req });
	// console.log(req.method, req.url);

	// CREATE NEW NOTIFICATION
	if (req.method === 'POST' && req.url === '/notifications') {
		try {
			postNotificationSchema.parse(req.body);
			req.body.createdAt = Date.now();
			req.body.seen = false;
		} catch (err) {
			console.log(err);
			return res
				.status(400)
				.json({ message: 'Invalid input', error: err.message });
		}
	}

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

		if (
			req.method === 'PUT' &&
			req.url === '/notifications' &&
			db.notifications?.length
		) {
			const parsedData = db?.notifications?.map((notification) => ({
				...notification,
				seen: true,
			}));

			fs.writeFile(
				dbPath,
				JSON.stringify({ ...db, notifications: parsedData }, null, 2),
				(writeErr) => {
					if (writeErr) {
						console.error('Error writing db.json:', writeErr);
						res.sendStatus(500); // Send a 500 Internal Server Error response
						return next();
					}

					res.header('Access-Control-Expose-Headers', 'X-Total, X-Unseen');
					res.header('X-Total', parsedData.length.toString());
					res.header('X-Unseen', '0');
					res.json({ message: 'Success' });
				}
			);
		} else {
			const notifications = db.notifications || [];
			const unseenCount = notifications.filter(
				(notification) => !notification.seen
			).length;

			// console.log('Setting Headers: X-Unseen-Count =', unseenCount.toString()); // Debug statement
			res.header('Access-Control-Expose-Headers', 'X-Total, X-Unseen');
			res.header('X-Total', notifications.length.toString());
			res.header('X-Unseen', unseenCount.toString());
			next();
		}
	});
};
