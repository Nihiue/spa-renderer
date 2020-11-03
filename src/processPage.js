module.exports = function () {
  function removeUselessNode(selectors) {
    selectors.forEach(function (selector) {
      const r = document.querySelectorAll(selector);
      r && [].forEach.call(r, function (el) {
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
      newNode.style.whiteSpace = 'pre';
      const text = el.contentDocument.querySelector('#notebook').textContent;
      newNode.textContent = text.substr(0, 100 * 1024);
      el.parentNode.appendChild(newNode);
      el.parentNode.removeChild(el);
    } catch (e) {

    }
  }

  removeUselessNode([
    'script',
    'link[rel=prefetch]',
    'link[rel=preload]',
    '[style*="display: none"]',
    '[style*="display:none"]'
  ]);
  processNotebookIframe();
  //removeUselessNode(['link[rel=stylesheet]','style']);
}
