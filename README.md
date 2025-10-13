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

// normalize any color value input to HSL or RGB
Color.toHSL(value, defaults)
Color.toRGB(value, defaults)
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

### color string matching

It also has a `.match()` method which takes a string and returns the first color string it finds in the form of a parsed array (if no color is found it returns null), for example:
```js
Color.match('color: rgba(34, 56, 88, 0.5); font-size: 23px;')
// returns ["rgb", "rgba(34, 56, 88, 0.5)", "34", "56", "88", "0.5"]
```

### color analysis

It can often be useful to know if a color is "light" or "dark" when pairing other colors with it, for example to determine if a font color should be black or white so that it best stands out on a given background color. The `.isLight()` method takes a color string (either in hex or rgb) and will return `true` if it is a light color or `false` if it is a dark color.
```js
Color.isLight('#ffffcc') // returns true
Color.isLight('#001100') // returns false
```

It's also useful to calculate the contrast ratio between two colors, to meet [WCAG](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG/Perceivable/Color_contrast) accessibility guidelines for example. For that there's `.contrast()`
```js
Color.contrast(colorA, colorB) // returns single number (7 = 7:1 ratio)
```

### color generation

There is also a `.random()` method for generating random color strings. It accepts two optional arguments, `type` and `alpha`. The `type` can be: 'hex', 'rgb', 'rgba', 'hsl' or 'hsla' and the `alpha` can be a float value (0.0 - 1.0) or a boolean
```js
Color.random() // returns a random hex color string, for ex: "#5cfba6"
Color.random('hex', 0.5) // could return for ex: "#5cfba67f"
Color.random('rgb') // ex: "rgb(136, 44, 204)"
Color.random('rgba') // ex: "rgba(85, 177, 23, 1)"
Color.random('rgb', true) // ex: "rgba(122, 46, 239, 0.53)"
Color.random('rgb', 0.5) // ex: "rgba(107, 110, 7, 0.5)"
```

You could also generate color schemes (arrays of related colors) with the `.scheme({ harmony, base })` method creates arrays of hex colors from harmony rules and a base color value. Options include:
```js
Color.scheme({
  harmony, // harmony string (see notes below)
  base, // base color (see notes below)
  // when 'base' is a number (degree hue) you can also adjust
  saturation: 90, // default 100
  lightness: 45, // default 50
  // whether or not to include the base color in the output
  includeBase: false, // default is true
  // number of colors in returned array
  count: 5,
  // additional scheme specific settings
  angle: 20, // to generate around base hue for 'analogous' colors
  lightnessRange: [20,60], // for 'monochromatic' and 'shades'
  offset: 25, // default 30, for 'complementary', 'split' and 'compound'
  // WCAG contrast controls
  contrast: 'AA', // can also be 'AAA' or number (aka minContrast)
  against: '#000', // a color to contrast against (aka contrastAgainst)
  steps: 1, // steps to take when adjusting (default 12)
  strategy: 'filter' // default is 'adjust' (aka contrastStrategy)
})
```

The `harmony` property can be one of:
- `analogous`
- `triad`
- `complementary`
- `split-complementary` (or `split`)
- `square`
- `compound`
- `monochromatic`
- `shades`
- `random` (uses `Color.random()`)

The `base` property can be:
- a hue number in degrees `0` - `360`
- a color string in Hex (ex: `'#ff0000'`) RGB, (ex: `rgb(255, 0, 0)` or HSL (ex: `hsl(0, 100, 50)`
- or an object `{h,s,l}` or `{h,s,v}` or `{r,g,b}`.

The WCAG adjustments only run if both `contrast` (alias `minContrast`, can be `AA` or `AAA` or a number) and `against` (alias `contrastAgainst`, color value) are not present. If so by default the `strategy` (alias `contrastStrategy`) property can either is set to `'adjust'` which will tweak lightness to reach the threshold, or you can alternatively set it to `'filter'` which will omit colors that don’t meet it.

When the `strategy` is `'adjust'` it will adjust the lightness of any non-compliant color by a given number of `steps` (default is `1`) in the scheme so that the hue and saturation remain the same (to keep the harmony as intact as possible), in some cases (ex: very mid-tone against another mid-tone) it might be impossible to reach the threshold within [0, 100] lightness, in these instances it will keep the original when set to 'adjust'.


Usage examples:
```js
// using hue in degrees with defaults (s=100, l=50)
Color.scheme({ harmony: 'complementary', base: 0 }) // ['#ff0000', '#00ffff']
Color.scheme({ harmony: 'triad', base: 0 }) // ['#ff0000', '#00ff00', '#0000ff']

// from a hex color
Color.scheme({ harmony: 'analogous', base: '#ff8800', count: 5, angle: 20 })

// customizing saturation/lightness when passing hue
Color.scheme({ harmony: 'square', base: 200, saturation: 90, lightness: 45 })

// monochromatic/shades vary lightness across a range
Color.scheme({ harmony: 'monochromatic', base: '#3366ff', count: 6, lightnessRange: [25, 80] })
Color.scheme({ harmony: 'shades', base: '#3366ff', count: 6 })

// split complementary with a custom offset (default 30)
Color.scheme({ harmony: 'split-complementary', base: '#ff0000', offset: 25 })

// compound scheme (base ±offset + complement ±offset)
Color.scheme({ harmony: 'compound', base: 30, offset: 25 })

// random hex colors (always hex array)
Color.scheme({ harmony: 'random', count: 5 })

// ensure WCAG contrast to a given color (AA=4.5, AAA=7)
Color.scheme({ harmony: 'analogous', base: '#3366ff', count: 5, contrast: 'AA', contrastAgainst: '#ffffff' })
// or numeric threshold and strategy 'adjust' (default) or 'filter'
Color.scheme({ harmony: 'complementary', base: 200, contrast: 7, contrastAgainst: '#000', contrastStrategy: 'adjust' })
```
