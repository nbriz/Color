# Color
A vanilla JS class with common Color maths.

## install

```
npm install git+https://github.com/nbriz/Color.git
```

on the web
```HTML
<script src="node_modules/Color/Color.js"></script>
```

or in node
```js
const Color = require('Color')
```

### test
```
npm run test
```

### Methods

```js
Color.alpha2hex(a)
Color.hex2alpha(hex)

Color.hex2rgb(hex)
Color.hex2hsl(hex)
Color.hex2hsv(hex)

Color.rgb2hex(r, g, b)
Color.rgb2hsl(r, g, b)
Color.rgb2hsv(r, g, b)

Color.hsl2hex(h, s, l)
Color.hsl2rgb(h, s, l)
Color.hsl2hsv(h, s, l)

Color.hsv2hex(h, s, v)
Color.hsv2rgb(h, s, v)
Color.hsv2hsl(h, s, v)
```

The methods that handle `hsv` and `hsl` values take/return `h` values between 0-360 and `s`, `v`, `l` values between 0-100. To work with floats, 0-1, add an underscore before the method name for example:
```js
Color._hsv2rgb(0, 1, 1) // returns { r: 1, g: 0, b: 0 }
// vs
Color.hsv2rgb(0, 100, 100) // returns { r: 255, g: 0, b: 0 }

Color.rgb2hsl(255, 0, 0) // returns { h: 0, s: 100, l: 50 }
// vs
Color._rgb2hsv(1, 0, 0) // returns { h: 0, s: 1, v: 1 }
```

It also has a `.match()` method takes a string and returns the first color string it finds in the form of a parsed array (if no color is found it returns null), for example:
```js
Color.match('color: rgba(34, 56, 88, 0.5); font-size: 23px;')
// returns ["rgb", "rgba(34, 56, 88, 0.5)", "34", "56", "88", "0.5"]
```
