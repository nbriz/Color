// node test.js
const Color = require('./Color.js')

const pass = (func) => console.log(`\x1b[32m${func} :: passed \x1b[0m`)
const fail = (func, got) => console.log(`\x1b[31m${func} :: got ${got}\x1b[0m`)
const test = (func, args, expect) => {
  const a = JSON.stringify(Color[func](...args))
  const b = JSON.stringify(expect)
  if (a === b) { pass(func) } else { fail(func, a) }
}

console.log('--- alpha ---')
test('alpha2hex', [0], '00')
test('alpha2hex', [0.5], '7f')
test('alpha2hex', [1], 'ff')
test('hex2alpha', ['00'], 0)
test('hex2alpha', ['7f'], 0.5)
test('hex2alpha', ['ff'], 1)

console.log('--- HEX ---')
test('_hex2rgb', ['#ff0000'], { r: 1, g: 0, b: 0 })
test('hex2rgb', ['#ff0000'], { r: 255, g: 0, b: 0 })
test('_hex2hsl', ['#ff0000'], { h: 0, s: 1, l: 0.5 })
test('hex2hsl', ['#ff0000'], { h: 0, s: 100, l: 50 })
test('_hex2hsv', ['#ff0000'], { h: 0, s: 1, v: 1 })
test('hex2hsv', ['#ff0000'], { h: 0, s: 100, v: 100 })

console.log('--- RGB ---')
test('_rgb2hex', [1, 0, 0], '#ff0000')
test('rgb2hex', [255, 0, 0], '#ff0000')
test('_rgb2hsl', [1, 0, 0], { h: 0, s: 1, l: 0.5 })
test('rgb2hsl', [255, 0, 0], { h: 0, s: 100, l: 50 })
test('_rgb2hsv', [1, 0, 0], { h: 0, s: 1, v: 1 })
test('rgb2hsv', [255, 0, 0], { h: 0, s: 100, v: 100 })

console.log('--- HSL ---')
test('_hsl2hex', [0, 1, 0.5], '#ff0000')
test('hsl2hex', [0, 100, 50], '#ff0000')
test('_hsl2rgb', [0, 1, 0.5], { r: 1, g: 0, b: 0 })
test('hsl2rgb', [0, 100, 50], { r: 255, g: 0, b: 0 })
test('_hsl2hsv', [0, 1, 0.5], { h: 0, s: 1, v: 1 })
test('hsl2hsv', [0, 100, 50], { h: 0, s: 100, v: 100 })

console.log('--- HSV ---')
test('_hsv2hex', [0, 1, 1], '#ff0000')
test('hsv2hex', [0, 100, 100], '#ff0000')
test('_hsv2rgb', [0, 1, 1], { r: 1, g: 0, b: 0 })
test('hsv2rgb', [0, 100, 100], { r: 255, g: 0, b: 0 })
test('_hsv2hsl', [0, 1, 1], { h: 0, s: 1, l: 0.5 })
test('hsv2hsl', [0, 100, 100], { h: 0, s: 100, l: 50 })
