const axios = require('axios');
const Promise = require('bluebird');
const fs = require('fs');
const _ = require('lodash');

function upload(options) {
	return (options.id ? deleteList(options) : createListEntity(options))
		.then(uploadList)
		.then(id => {
			console.log(`Uploaded list successfully\nList ID: ${id}`);
		})
		.catch(e => {
			console.error(`Failed to upload list: ${e.message}`);
		});
}

function createListEntity({ type, buffer, sessionToken, name }) {
	let authOptions = {
		method: 'POST',
		url: `https://partners.streamrail.com/api/v2/${_.kebabCase(type)}-lists`,
		headers: {
			authorization: `Bearer ${sessionToken}`
		},
		data: {
			[`${_.camelCase(type)}List`]: {
				name
			}
		}
	};
	return axios(authOptions).then(res => {
		return {
			id: res.data[`${_.camelCase(type)}List`].id,
			buffer,
			type,
			sessionToken,
			name
		};
	});
}

function deleteList({ id, buffer, type, sessionToken }) {
	let authOptions = {
		method: 'DELETE',
		url: `https://ssp-upload.streamrail.net/upload/${type}list/${id}`,
		headers: {
			Authorization: `bearer ${sessionToken}`,
			origin: 'https://partners.streamrail.com/',
			referer: 'https://partners.streamrail.com/'
		}
	};
	return axios(authOptions).then(() => ({
		id,
		type,
		sessionToken,
		buffer
	}));
}

function uploadList({ id, buffer, type, sessionToken, name }) {
	let crlf = '\r\n',
		boundaryKey = Math.random().toString(16),
		boundary = `--${boundaryKey}`,
		delimeter = `${crlf}--${boundary}`,
		headers = [`Content-Disposition: form-data; name="file"; filename="list.csv"` + crlf],
		closeDelimeter = `${delimeter}--`,
		multipartBody;

	const listStr = buffer.join('\n');
	multipartBody = Buffer.concat([
		new Buffer(delimeter + crlf + headers.join('\n') + crlf),
		buffer,
		new Buffer(closeDelimeter)
	]);

	let authOptions = {
		method: 'POST',
		url: `https://ssp-upload.streamrail.net/upload/${_.kebabCase(type)}list/${id}`,
		headers: {
			Authorization: `bearer ${sessionToken}`,
			'Content-Type': 'multipart/form-data; boundary=' + boundary,
			'Content-Length': multipartBody.length,
			origin: 'https://partners.streamrail.com/',
			referer: 'https://partners.streamrail.com/'
		},
		data: toArrayBuffer(multipartBody)
	};
	return axios(authOptions).then(() => id);
}

function toArrayBuffer(buffer) {
	const arrayBuffer = new ArrayBuffer(buffer.length);
	const view = new Uint8Array(arrayBuffer);
	for (let i = 0; i < buffer.length; ++i) {
		view[i] = buffer[i];
	}
	return arrayBuffer;
}

module.exports = upload;
