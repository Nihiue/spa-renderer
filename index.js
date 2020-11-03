const app = require('./src/index.js');
const url = require('url');

const config = require('./src/config.js');

const { getCache, setCache } = require('./src/cache.js');

exports.handler = async function (event, context, callback) {

    const resp = {
        'isBase64Encoded': false,
        'statusCode': 200,
        'headers': {
            'X-From-Service': 'SpaRendererChrome',
            'Content-Type': 'text/html; charset=utf-8'
        },
        'body': ''
    };

    try {
        if (typeof event === 'string') {
            event = JSON.parse(event);
        }

        const query = event.queryParameters || event.queryStringParameters;

        if (!query || !query.url) {
            throw new Error('no url');
        }

        const targetUrl = url.parse(query.url);

        if (targetUrl.protocol !== 'http:' && targetUrl.protocol !== 'https:') {
            throw new Error('invalid url');
        }

        if (config.allowHostRegx && !targetUrl.host.match(config.allowHostRegx)) {
            throw new Error('invalid url');
        }

        let bodyContent;

        if (!query.force) {
            bodyContent = getCache(targetUrl.href);
        }

        if (!bodyContent) {
            bodyContent = await app.renderPage(targetUrl.href);
            setCache(targetUrl.href, bodyContent);
        }

        resp.body = bodyContent;
        callback(null, resp);

    } catch (e) {
        resp.body = e && e.toString();
        resp.statusCode = 400;
        callback(null, resp);
    }

}
