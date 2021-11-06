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
Color.hsv2rgb(0, 100, 100) // returns { r: 255, g: 0, b: 0 }
// becomes
Color._hsv2rgb(0, 1, 1) // returns { r: 1, g: 0, b: 0 }

Color.rgb2hsl(255, 0, 0) // returns { h: 0, s: 100, l: 50 }
// becomes
Color._rgb2hsv(1, 0, 0) // returns { h: 0, s: 1, v: 1 }
```


There is also a `.random()` method for generating random color strings. It accepts two optional arguments, `type` and `alpha`. The `type` can be: 'hex', 'rgb', 'rgba', 'hsl' or 'hsla' and the `alpha` can be a float value (0.0 - 1.0) or a boolean
```js
Color.random() // returns a random hex color string, for ex: "#5cfba6"
Color.random('hex', 0.5) // could return for ex: "#5cfba67f"
Color.random('rgb') // ex: "rgb(136, 44, 204)"
Color.random('rgba') // ex: "rgba(85, 177, 23, 1)"
Color.random('rgb', true) // ex: "rgba(122, 46, 239, 0.53)"
Color.random('rgb', 0.5) // ex: "rgba(107, 110, 7, 0.5)"
```

It can often be useful to know if a color is "light" or "dark" when pairing other colors with it, for example to determine if a font color should be black or white so that it best stands out on a given background color. The `.isLight()` method takes a color string (either in hex or rgb) and will return `true` if it is a light color or `false` if it is a dark color
```js
Color.isLight('#ffffcc') // returns true
Color.isLight('#001100') // returns false
```


It also has a `.match()` method takes a string and returns the first color string it finds in the form of a parsed array (if no color is found it returns null), for example:
```js
Color.match('color: rgba(34, 56, 88, 0.5); font-size: 23px;')
// returns ["rgb", "rgba(34, 56, 88, 0.5)", "34", "56", "88", "0.5"]
```
