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
        page.injectJs('processPage.js');
        // Wait for SPA to render the page
        setTimeout(function() {
            page.evaluate(function() {
                window._SPA_PROCESS_PAGE();
            })
            system.stdout.write(page.content);
            phantom.exit(0);
        }, WAIT_SPA_READY_TIME);
    }
});