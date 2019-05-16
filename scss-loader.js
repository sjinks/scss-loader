(function() {
	let d = document, current;

	let domReady = (cb) => {
		d.readyState === 'loading' ? d.addEventListener('DOMContentLoaded', cb) : cb();
	};

	let resolver = (request, done) => {
		let file = request.current;
		if (file.indexOf('.') === -1) {
			file += '.scss';
		}

		if (file.indexOf('/') === -1) {
			if (file[0] !== '_') {
				file = '_' + file;
			}
		}
		else if (/\/([^/]+$)/.test(file)) {
			file = file.replace(/\/([^/]+)$/, '/_$1');
		}

		let url = (current || '').replace(/\/([^/]+)$/, '/') + file;
		fetch(url).then((response) => {
			if (response.ok) {
				return response.text();
			}

			throw new Error('Error loading ' + url);
		}).then((text) => {
			done({ content: text });
		}).catch((error) => {
			console.error(error.message);
			done({ error: error.message });
		});
	};

	let compiledCallback = (compiled) => {
		if ('text' in compiled) {
			let style   = d.createElement('style');
			let content = d.createTextNode(compiled.text);
			style.setAttribute('type', 'text/css');
			style.appendChild(content);
			d.head.appendChild(style);
			current = null;
		}
		else if ('formatted' in compiled) {
			console.error(compiled.formatted);
		}
	};

	let onDomReady = () => {
		let callback = () => {
			Sass.importer(resolver);

			d.querySelectorAll('link[type="text/scss"][href], style[type="text/scss"]').forEach((e) => {
				if (e.tagName.toLowerCase() === 'style') {
					current = location.href;
					Sass.compile(e.textContent, { indentedSyntax: false }, compiledCallback);
				}
				else {
					fetch(e.href).then((response) => {
						if (response.ok) {
							return response.text();
						}

						throw new Error('Error loading ' + e.href);
					}).then((text) => {
						current = e.href;
						Sass.compile(text, { indentedSyntax: false }, compiledCallback);
					}).catch((error) => {
						console.error('Error: ' + error.message);
						current = null;
					});
				}
			});
		};

		if (typeof Sass === 'undefined') {
			let script = d.createElement('script');
			script.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/sass.js/0.10.13/sass.sync.min.js');
			script.addEventListener('load', callback);
			d.head.appendChild(script);
		}
		else {
			callback();
		}
	};

	domReady(onDomReady);
})();
