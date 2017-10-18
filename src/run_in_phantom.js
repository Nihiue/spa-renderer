/*
    This script runs in PhantomJS
    For More API, see http://phantomjs.org/documentation/
*/

var CUSTOM_UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3160.0 Safari/537.36 SpaRenderer/0.1.1';
var VIEWPORT_WIDTH = 1600;
var VIEWPORT_HEIGHT = 900;
var WAIT_SPA_READY_TIME = 2500;

var page = require('webpage').create();
var system = require('system');

if (system.args.length === 1) {
    system.stdout.write('url is required');
    phantom.exit(1);
}
page.settings.loadImages = false;
page.settings.resourceTimeout = 5000;
page.settings.userAgent = CUSTOM_UA;
page.viewportSize = { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT };

page.open(system.args[1], function(status) {
    if (status !== 'success') {
        system.stdout.write('load page fail:' + system.args[1]);
        phantom.exit(1);
    } else {
        // Wait for SPA to render the page
        setTimeout(function() {
            page.evaluate(function() {
                function removeUselessNode(selector) {
                    const r = document.querySelectorAll(selector);
                    r && [].forEach.call(r, function(el) {
                        el.parentNode && el.parentNode.removeChild(el);
                    });
                }
                function processNotebookIframe() {
                    try {
                        const el = document.querySelector('iframe.nb-iframe-resize');
                        if (!el || !el.contentDocument) {
                            return;
                        }
                        const newNode = document.createElement('article');
                        newNode.innerHTML = el.contentDocument.querySelector('#notebook').innerHTML;
                        el.parentNode.insertBefore(newNode, el);
                        el.parentNode.removeChild(el);
                    } catch (e) {

                    }
                }
                removeUselessNode('script');
                removeUselessNode('link[rel=prefetch]');
                removeUselessNode('link[rel=preload]');
                removeUselessNode('[style*="display: none"]');
                removeUselessNode('[style*="display:none"]');
                processNotebookIframe();
                //removeUselessNode('link[rel=stylesheet]');
                //removeUselessNode('style');
            });
            system.stdout.write(page.content);
            phantom.exit(0);
        }, WAIT_SPA_READY_TIME);
    }
});