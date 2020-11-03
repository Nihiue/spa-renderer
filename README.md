# spa-renderer

Prerender single page application for SEO, with out-of-box supprort for deploying to`AWS Lambda` or `Aliyun Function Compute`.

This project is inspired by [prerender](https://github.com/prerender/prerender) , but `spa-renderer` is a more lightweight and cheap solution.

## Test & Deploy

### Step 1.  Install dependency

``` bash
$ npm install
```

### Step 2. Run test

``` bash
$ npm run test
```

### Step 3.  Create service and deploy code

#### AWS Lambda

Compress the folder into `dist.zip`

Login to https://aws.amazon.com , find Service - Compute - Lambda , and create a new lambda function

here are some key points:

* Trigger : API Gateway
* Name: `spa-renderer` or anything you like :)
* Runtime: Node.js 12.x
* Code entry type: upload your  `dist.zip` as code file
* Handler: `index.handler`
* Role:  create one if needed
* Advanced settings -> Memory:  1024 MB is enough for most cases
* Advanced settings -> Timeout: 5 - 20 seconds


#### Aliyun Function Compute (阿里云 函数计算 )
在阿里云上创建一个函数计算的实例

* 运行环境 Node.js 12.x
* 超时： 5-20 秒
* 内存： 1024 MB
* 函数入口： `index.handler`
* 代码上传：使用 [fcli](https://help.aliyun.com/document_detail/52995.htm)，详见文档
* 需要关联一个 API网关到这个服务，才能通过网关访问
