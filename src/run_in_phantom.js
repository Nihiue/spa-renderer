/*
    This script runs in PhantomJS
    For More API, see http://phantomjs.org/documentation/
*/

var CUSTOM_UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3160.0 Safari/537.36 SpaRenderer/0.1.0';
var VIEWPORT_WIDTH = 1280
var VIEWPORT_HEIGHT = 720;
var WAIT_SPA_READY_TIME = 1500;

var page = require('webpage').create();
var system = require('system');

if (system.args.length === 1) {
    console.log('url is required');
    phantom.exit(1);
}

page.settings.userAgent = CUSTOM_UA;
page.viewportSize = { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT };

page.open(system.args[1], function(status) {
    if (status !== 'success') {
        console.log('load page fail:' + status);
        phantom.exit(1);
    } else {
        // Wait for SPA to render the page
        setTimeout(function() {
            const domSnapshot = page.evaluate(function() {
                function removeUselessNode(selector) {
                    const r = document.querySelectorAll(selector);
                    r && [].forEach.call(r, function(el) {
                        el.parentNode && el.parentNode.removeChild(el);
                    });
                }
                removeUselessNode('script');
                removeUselessNode('link[rel=prefetch]');
                removeUselessNode('link[rel=preload]');
                //removeUselessNode('link[rel=stylesheet]');
                //removeUselessNode('style');
                return document.querySelector('html').outerHTML;
            });
            console.log(domSnapshot);
            phantom.exit(0);
        }, WAIT_SPA_READY_TIME);
    }
});