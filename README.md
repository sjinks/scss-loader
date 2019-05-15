# scss-loader

Load SCSS files in a browser

## Installation

```html
<script src="scss-loader.js"></script>
```

## Usage

The script automatically finds `style` and `link` tags with `type="text/scss"` and passes them to [Sass.js](https://github.com/medialize/sass.js).
Sass.js compiles SCSS files, and the generated CSS is then appended to `<head>` tag.
