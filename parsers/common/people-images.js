'use strict';

const request = require('request'),
	winston = require('../../winston-logger'),
	jsonHandler = require('../../utils/json-handler');

function getImage(person) {
	return new Promise((resolve, reject) => {
		request(
			'https://en.wikipedia.org/w/api.php?action=query&titles=' +
				person.abbrName +
				'&prop=pageimages&format=json&pithumbsize=600',
			(err, response, body) => {
				if (err) {
					reject(err);
				} else {
					let url;

					body = jsonHandler.parse(body);

					if (body.query && body.query.pages) {
						Object.keys(body.query.pages).forEach(key => {
							url = body.query.pages[key].thumbnail
								? body.query.pages[key].thumbnail.source
								: null;
						});
					}

					resolve({
						url
					});
				}
			}
		);
	});
}

class PeopleImages {
	handle(people) {
		const actions = people && people.length ? people.map(getImage) : [],
			results = actions.length ? Promise.all(actions) : null;

		if (results) {
			results
				.then(images => {
					images.forEach((img, index) => {
						if (img && img.url) {
							people[index].img = img.url;
						}
					});
				})
				.catch(error => {
					winston.logger.error(
						'[parsers-common-people-images]\n\n' + error
					);
				});
		}
	}
}

module.exports = new PeopleImages();
