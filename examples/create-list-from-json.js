const upload = require('../lib/upload');
const list = require('./lists/list.json');
const buffer = Buffer.from(list.join('\n'), 'utf8');

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