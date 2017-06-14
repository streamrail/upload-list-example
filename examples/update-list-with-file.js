const upload = require('../lib/upload');
const fs = require('fs');
const path = require('path');
const buffer = fs.readFileSync(path.join(__dirname, 'lists/list.csv'));

upload({
    // id of list
    id: '<list-id>',

	// 'domain' for domains list; 'app' for bundle IDs list
	type: 'domain',

	// A buffer of items
	buffer: buffer,

	// A Login session token
	sessionToken: '<your-login-session-token>'
});