'use strict';
const spawn = require('child_process').spawn;
const path = require('path');

const SERVER_PHANTOM_PATH = path.join(__dirname, 'phantomjs/bin/phantomjs');
const LOCAL_PHANTOM_PATH = path.join(__dirname, 'phantomjs/bin/phantomjs');

let APP_START_TIME = Date.now();

const DEBUG = true;

function debugLogger(str) {
    if (!DEBUG) {
        return;
    }
    console.log(` ${(Date.now() - APP_START_TIME)/1000}:\t${str}`);
}

function hasArg(t) {
    return process.argv.find((v) => {
        return t === v;
    });
}

function spaRenderer(url) {
    return new Promise((resolve, reject) => {
        let rawData = '';
        let currentPhantomPath = hasArg('--local-sr-mode') ? LOCAL_PHANTOM_PATH : SERVER_PHANTOM_PATH;
        const handler = spawn(currentPhantomPath, ['--web-security=no', path.join(__dirname, './phantomDriver.js'), url]);
        handler.stdout.on('data', (data) => {
            rawData = rawData + data;
        });
        handler.on('error', (e) => {
            debugLogger('cannot launch phantomjs: is PHANTOM_PATH correct?  See README.md');
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
        let targetUrl = query && query.url;
        if (!targetUrl) {
            throw new Error('no url specified');
        } else if (!(/^(https|http):\/\//i).test(targetUrl)) {
            targetUrl = 'http://' + targetUrl;
        }

        targetUrl = targetUrl.replace('_hash_escape_', '#');
        debugLogger('target page:' + targetUrl);
        resp.body = await spaRenderer(targetUrl);
        debugLogger('renderer success');

        callback(null, resp);
    } catch (e) {
        debugLogger('renderer fail: ' + e);
        resp.body = e && e.toString();
        resp.statusCode = 400;

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


if (process.argv.length > 3 && hasArg('--local-sr-mode')) {
    appEntry({
        url: process.argv[process.argv.length - 1]
    }, (placeHolder, retObj) => {
        console.log('local run end');
        console.log(' ------------------------------');
        console.log(retObj);
    });
}