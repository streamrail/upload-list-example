const upload = require('../lib/upload');
const list = require('./lists/list.json');
const buffer = Buffer.from(list.join('\n'), 'utf8');

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
