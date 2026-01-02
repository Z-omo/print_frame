'use strict';

const PF = {

  view: {
    frameID: 'printFrame',
    frame: null
  },

  printThis(view, callback, title) {
    prepareFrame();

    const style = 'position:fixed;bottom:-100%;left:-100%;';
    PF.view.frame.setAttribute('style', style);

    PF.view.frame.addEventListener(
      'load', () => { callToPrint(); }, { once: true }
    );

    if (title) { title = formatFileSafeTitle(title); }
    setFrameView(view, title);

    PF.view.frame.contentWindow.addEventListener('afterprint', () => {
      afterPrint();
      if (callback) { callback(); }
    }, { once: true });
  },

  remove() {
    removePrintFrame();
  }
};

export default PF;

function prepareFrame(container = document.body) {
  let frame = document.getElementById(PF.view.frameID);
  if (!frame) { frame = buildFrame(); }

  container.appendChild(frame);
  PF.view.frame = frame;
}

function buildFrame() {
  const frame = document.createElement('iframe');
  frame.id = PF.view.frameID;

  return frame;
}

function setFrameView(view, title) {
  const frame = PF.view.frame;
  if (!frame) { return; }

  if (view.nodeType) { view = view.outerHTML; }

  frame.contentWindow.document.open();
  frame.contentWindow.document.write(view);
  if (title) { setDocumentTitle(title); }
  frame.contentWindow.document.close();
}

function callToPrint() {
  const frame = PF.view.frame;

  if (!frame) {
    throw new Error('Cannot action Print command without a prepared print frame.');
  }

  const result = frame.contentWindow.document.execCommand('print', true);
  if (false === result) { frame.contentWindow.print(); }
}

function afterPrint() {
  // reset Chrome browser parent document title.
  if (PF.view.chromeTitle) {
    PF.view.frame.contentWindow.parent.document.title = PF.view.chromeTitle;
    PF.view.chromeTitle = '';
  }
}

function removePrintFrame() {
  prepareFrame();
  PF.view.frame.remove();
  PF.view.frame = null;
}

function formatFileSafeTitle(string) {
  let safe = string.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&(amp;)?/g, ' and ')
    .replace(/[^0-9a-z\s-–—]/gi, '')
    .replace(/[\s–—]+/g, '-');

  return safe;
}

function setDocumentTitle(title) {
  const frame = PF.view.frame;
  frame.contentWindow.document.title = title;

  const chrome = /Chrome\//.test(navigator.userAgent)
    && /Google Inc/.test(navigator.vendor);
  if (!chrome) { return; }

  PF.view.chromeTitle = frame.contentWindow.parent.document.title;
  frame.contentWindow.parent.document.title = title;
}
