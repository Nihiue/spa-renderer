# spa-renderer

Prerender single page application for SEO, with out-of-box supprort for deploying to`AWS Lambda` or `Aliyun Function Compute`.

This project is inspired by [prerender](https://github.com/prerender/prerender) , but `spa-renderer` is a more lightweight and cheap solution. 

## Develop & Test

### Download phantomjs and config

Download [phantomjs](http://phantomjs.org/download.html)  for your develop platform,  and modify LOCAL_PHANTOM_PATH in ./src/index.js

### Run spa-renderer in local shell

``` bash
$ node ./src/index.js --local-sr-mode https://www.foo.bar/test/_hashbang_/frontend/router/path
```
spa-render will replace `_hashbang_` with `#!` 


## Deploy

### Step 1.  Build this project

Install dev dependency if needed

``` bash
$ npm install
```
build

``` bash
$ npm run build
```

### Step 2.  Download phantomjs for server

Download **phantomjs for linux 64bit** from [Here](http://phantomjs.org/download.html),  and extract it to ./dist 

Your dist folder should look like this

``` plain
dist
 ├── index.js
 ├── phantomDriver.js
 ├── processPage.js
 ├── phantomjs
 ├   └── bin
 ├        └── phantomjs

```

### Step 3.  Create service and deploy code

#### AWS Lambda

Compress the **content** of dist folder into `dist.zip`

Login to https://aws.amazon.com , find Service - Compute - Lambda , and create a new lambda function

here are some key points:
 
* Trigger : API Gateway
* Name: `spa-renderer` or anything you like :)
* Runtime: Node.js 6.x 
* Code entry type: upload your  `dist.zip` as code file
* Handler: `index.handler_aws_lambda`
* Role:  create one if needed
* Advanced settings -> Memory:  128MB is enough for most cases
* Advanced settings -> Timeout: 5 - 20 seconds

API url can be found in Triggers Tab

Usage: 

``` plain
https://XXXXX.execute-api.XXXXX.amazonaws.com/prod/spa-renderer?url=https://www.foo.bar/test/_hashbang_/frontend/router/path
```


#### Aliyun Function Compute (阿里云 函数计算 )
在阿里云上创建一个函数计算的实例

* 运行环境 Node.js 6.x
* 超时： 5-20 秒
* 内存： 128MB 
* 函数入口： `index.handler_aliyun_fc`
* 代码上传：使用 [fcli](https://help.aliyun.com/document_detail/52995.htm)，详见文档
* 需要关联一个 API网关到这个服务，才能通过网关访问

API的访问地址比较隐蔽，在API详情点击编辑， 在第二步的地方可以看到二级域名和请求Path
 
用法

``` plain
http://XXXXX.alicloudapi.com/spa_render?url=https://www.foo.bar/test/_hashbang_/frontend/router/path
```
