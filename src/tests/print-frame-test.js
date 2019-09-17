import test from 'ava';
import PF from '../print-frame.js';

test('PrintFrame imported is an object', t => {
  t.is(typeof PF, 'object');
});

test('PrintFrame object has a view property object', t => {
  t.is(typeof PF.view, 'object');
});

test('PrintFrame provides public methods', t => {
  t.is(typeof PF.printThis, 'function');
  t.is(typeof PF.remove, 'function');
});

const content = '<h1>Print Test</h1>';
let frame = null;
PF.printThis(content);

test('PrintFrame builds iframe element into the DOM', t => {
  frame = document.querySelector('#' + PF.view.frameID);
  t.is(frame.nodeName, 'IFRAME')
  t.is(PF.view.frame, frame);
});

test('PrintFrame hides inserted iframe from view', t => {
  frame = document.querySelector('#' + PF.view.frameID);

  const style = frame.getAttribute('style');
  t.is(style, 'position:fixed;bottom:-100%;left:-100%;');
});

test('PrintFrame sets iframe string content correctly', t => {
  const frameContent = frame.contentWindow.document.body.innerHTML;
  t.is(typeof frameContent, 'string');
  t.is(frameContent, content);
});

test('PrintFrame sets iframe with DOM element content correctly', t => {
  const div = document.createElement('div');
  div.id = 'testDiv';
  div.innerHTML = content;

  PF.printThis(div);

  const frameContent = frame.contentWindow.document.body.innerHTML;
  t.is(typeof frameContent, 'string');
  t.is(div.outerHTML, frameContent);
});

test('PrintFrame removes iframe element from DOM', t => {
  PF.remove();

  const removed = document.querySelector('#' + PF.view.frameID);
  t.not(frame, removed);
  t.not(PF.view.frame, frame);
});

test('PrintFrame sets iframe document title to a URL safe filename', t => {
  const testTitles = [
    'Foo &amp; Bar', 'Tést—001 for fü bar', 'Wow! that was "great!?"'
  ];

  const expected = [
    'Foo-and-Bar', 'Test-001-for-fu-bar', 'Wow-that-was-great'
  ];

  testTitles.forEach((title, index) => {
    PF.printThis(content, undefined, title);
    frame = document.querySelector('#' + PF.view.frameID);
    noPrintDialog(frame);

    const docTitle = frame.contentWindow.document.title;

    t.is(typeof docTitle, 'string');
    t.is(docTitle, expected[index]);
  });
});

function noPrintDialog(frame)
{
  const dummy = () => { return; }
  frame.contentWindow.print = dummy;
  frame.contentWindow.document.execCommand = dummy;
}

