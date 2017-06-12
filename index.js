const axios = require('axios');
const Promise = require('bluebird');

///////////////////////////////////////////
// Example for uploading an array of domain:
///////////////////////////////////////////

upload({
	// 'domain' for domains list; 'app' for bundle IDs list
	listType: 'domain',

	// The name of the list
	name: 'My Domain List',

	// An array of strings. The items to upload.
	items: ['domain1.com', 'domain2.com', 'domain3.com', 'domain4.com', 'domain5.com'],

	// A Login session token
	sessionToken: '<your-login-session-token>'
});

function upload(options) {
	return createListEntity(options)
		.then(uploadList)
		.then(listId => {
			console.log(`Uploaded list successfully\nList ID: ${listId}`);
		})
		.catch(e => {
			console.error(`Failed to upload list: ${e.message}`);
		});
}

function createListEntity({ listType, items, sessionToken, name }) {
	let authOptions = {
		method: 'POST',
		url: `https://partners.streamrail.com/api/v2/${listType}-lists`,
		headers: {
			authorization: `Bearer ${sessionToken}`
		},
		data: {
			[`${listType}List`]: {
				name
			}
		}
	};
	return axios(authOptions).then(res => {
		return {
			listId: res.data[`${listType}List`].id,
			items,
			listType,
			sessionToken,
			name
		};
	});
}

function uploadList({ items, listType, sessionToken, name, listId }) {
	let crlf = '\r\n',
		boundaryKey = Math.random().toString(16),
		boundary = `--${boundaryKey}`,
		delimeter = `${crlf}--${boundary}`,
		headers = [`Content-Disposition: form-data; name="file"; filename="${name}.txt"` + crlf],
		closeDelimeter = `${delimeter}--`,
		multipartBody;

	const listStr = items.join('\n');
	multipartBody = Buffer.concat([
		new Buffer(delimeter + crlf + headers.join('\n') + crlf),
		Buffer.from(listStr, 'utf8'),
		new Buffer(closeDelimeter)
	]);

	let authOptions = {
		method: 'POST',
		url: `https://ssp-upload.streamrail.net/upload/${listType}list/${listId}`,
		headers: {
			Authorization: `bearer ${sessionToken}`,
			'Content-Type': 'multipart/form-data; boundary=' + boundary,
			'Content-Length': multipartBody.length,
			origin: 'https://partners.streamrail.com',
			referer: 'https://partners.streamrail.com'
		},
		data: toArrayBuffer(multipartBody)
	};

	return axios(authOptions).then(() => listId);
}

function toArrayBuffer(buffer) {
	const arrayBuffer = new ArrayBuffer(buffer.length);
	const view = new Uint8Array(arrayBuffer);
	for (let i = 0; i < buffer.length; ++i) {
		view[i] = buffer[i];
	}
	return arrayBuffer;
}
