# PrintFrame

PrintFrame is a simple JavaScript module which facilitates the printing of HTML content, from external files or from within a specified DOM element.

## Usage

In its simplest form, the PrintFrame *printThis* function can be passed a string to invoke the browser's print dialog.

```javascript
import pFrame from './src/print-frame.js';

const content = '<h1>My printed content</h1>';
pFrame.printThis(content);
```

HTML content from an external file can be printed by first loading the external content as a string.

```javascript
fetch("url-to/external-file.html")
  .then((response) => response.text())
  .then((html) => {
    pFrame.printThis(html);
  });
```

You can also pass a DOM element to PrintFrame to print the element's content.

```javascript
const element = document.getElementById('element_id');

pFrame.printThis(element);
```

PrintFrame will get the element's outerHTML to set this as the iframe's content.

You can also pass a callback as the second argument to be called when the [*afterprint* event](https://developer.mozilla.org/en-US/docs/Web/API/Window/afterprint_event) has fired.

```javascript
function myCallback() {
 // do something after print…
}

const content = '<h1>My printed content</h1>';

pFrame.printThis(content, myCallback);
```

PrintFrame can also take a third argument to set a title string from which PrintFrame will format into a URL safe name. This is useful, when the user chooses to print to PDF from the browser print dialog – the formatted title is used as the PDF filename.

```javascript
const content = '<h1>My printed content</h1>';

pFrame.printThis(content, myCallback, 'Print content title');
```
