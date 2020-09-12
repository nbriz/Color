# Color
A vanilla JS class with common Color maths. The methods that handle `hsv` and `hsl` values take/return `h` values between 0-360 and `s`, `v`, `l` values between 0-100. To work with floats, 0-1, add an underscore before the method name, for example `Color._hsv2hex(h, s, v)` takes float values as arguments, or `Color._rgb2hsl(r, g, b)` returns float values, or `Color._hsl2hsv(h, s, l)` both takes and returns values in floats.

```js
Color.alpha2hex(a)
Color.hex2alpha(hex)

Color.hex2rgb(hex)
Color.hex2hsl(hex)
Color.hex2hsv(hex)

Color.rgb2hex(r, g, b)
Color.rgb2hsv(r, g, b)
Color.rgb2hsl(r, g, b)

Color.hsv2hex(h, s, v)
Color.hsv2rgb(h, s, v)
Color.hsv2hsl(h, s, v)

Color.hsl2hex(h, s, l)
Color.hsl2rgb(h, s, l)
Color.hsl2hsv(h, s, l)
```

It also has a `.match()` method takes a string and returns the first color string it finds in the form of a parsed array (if no color is found it returns null), for example:
```js
Color.match('color: rgba(34, 56, 88, 0.5); font-size: 23px;')
// returns ["rgb", "rgba(34, 56, 88, 0.5)", "34", "56", "88", "0.5"]
```
