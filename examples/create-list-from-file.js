const upload = require('../lib/upload');
const fs = require('fs');
const path = require('path');
const buffer = fs.readFileSync(path.join(__dirname, 'lists/list.csv'));

upload({
	// 'domain' for domains list; 'app' for bundle IDs list
	listType: 'domain',

	// The name of the list
	name: 'My Domain List',

	// A buffer of items
	buffer: buffer,

	// A Login session token
	sessionToken: '<your-login-session-token>'
});
