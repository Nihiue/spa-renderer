'use strict';
process.env.AWS_LAMBDA_FUNCTION_NAME = 'TEST';
process.env.AWS_EXECUTION_ENV = 'AWS_Lambda_nodejs12.x';

const { handler } = require('./index.js');


async function test(url) {
  handler({
    queryParameters: {
      url,
    }
  }, null, (err, data) => {
    console.log('#', data.statusCode === 200 ? 'ok' : 'fail', i);
  });
};



test('https://www.baidu.com');
