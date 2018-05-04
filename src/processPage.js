window._SPA_PROCESS_PAGE = function() {

    function removeUselessNode(selectors) {
        selectors.forEach(function(selector) {
            const r = document.querySelectorAll(selector);
            r && [].forEach.call(r, function(el) {
                el.parentNode && el.parentNode.removeChild(el);
            });
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
            el.parentNode.appendChild(newNode);
            el.parentNode.removeChild(el);
        } catch (e) {

        }
    }
    function processHelpIframe() {
        try {
            if (location.href.indexOf('/apps/home/workspace/help') < 0) {
                return;
            }
            const el = document.querySelector('.fs-manual-iframe-container iframe');
            if (!el || !el.contentDocument) {
                return;
            }
            const newNode = document.createElement('div');
            var rawHTML = el.contentDocument.querySelector('.book').innerHTML;
       
            rawHTML = rawHTML.replace(/href="(ch[^"]*html)"/g, function(a,b,c) {
                return 'href="/apps/home/workspace/help?focus=' + encodeURIComponent(b) + '"';
            });
            newNode.innerHTML = rawHTML;
            el.parentNode.appendChild(newNode);
            el.parentNode.removeChild(el);

        } catch (e) {}
    }

    removeUselessNode([
        'script',
        'link[rel=prefetch]',
        'link[rel=preload]',
        '[style*="display: none"]',
        '[style*="display:none"]'
    ]);
    processNotebookIframe();
    processHelpIframe();
    //removeUselessNode(['link[rel=stylesheet]','style']);
};