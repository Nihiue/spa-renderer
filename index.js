'use strict';
const spawn = require('child_process').spawn;
const path = require('path');

const PHANTOM_PATH = path.join(__dirname, './phantomjs/bin/phantomjs');

let APP_START_TIME = Date.now();

const DEBUG = true;

function debugLogger(str) {
    if (!DEBUG) {
        return;
    }
    console.log(` ${(Date.now() - APP_START_TIME)/1000}:\t${str}`);
}

function spaRenderer(url) {
    return new Promise((resolve, reject) => {
        let rawData = '';
        const handler = spawn(PHANTOM_PATH, [path.join(__dirname, './run_in_phantom.js'), url]);
        handler.stdout.on('data', (data) => {
            rawData = rawData + data;
        });
        handler.on('error', (e) => {
            debugLogger('cannot launch phantomjs: is phantomjs in this path?');
            reject(e);
        });
        handler.on('exit', (code, signal) => {
            if (code === 0) {
                resolve(rawData);
            } else {
                reject(rawData);
            }
        });
    });
}

async function appEntry(query, callback) {
    APP_START_TIME = Date.now();
    const resp = {
        'isBase64Encoded': false,
        'statusCode': 200,
        'headers': {
            'X-From-Service': 'SpaRenderer',
            'Content-Type': 'text/html; charset=utf-8'
        },
        'body': ''
    };

    try {
        let targetUrl = query.url;
        if (!targetUrl) {
            throw new Error('no url specified');
        }

        targetUrl = targetUrl.replace('_hashbang_', '#!');
        debugLogger('target page:' + targetUrl);
        resp.body = await spaRenderer(targetUrl);
        debugLogger('renderer success');

        callback(null, resp);
    } catch (e) {
        debugLogger('renderer fail: ' + e);
        resp.body = e && e.toString();
        resp.code = 400;

        callback(null, resp);
    }

}

exports.handler_aliyun_fc = (eventBuf, context, callback) => {
    const event = JSON.parse(eventBuf);
    appEntry(event.queryParameters, callback);
};

exports.handler_aws_lambda = (event, context, callback) => {
    appEntry(event.queryStringParameters, callback);
};


if (process.argv.length > 3 && process.argv[2] === '--dry-run') {
    appEntry({
        url: process.argv[3]
    }, (placeHolder, retObj) => {
        console.log('dry run end');
        console.log(' ------------------------------');
        console.log(retObj);
    });
}