/*
    Color
    -----------
    by Nick Briz <nickbriz@gmail.com>
    GNU GPLv3 - https://www.gnu.org/licenses/gpl-3.0.txt
    2019

    -----------
       info
    -----------

    A vanilla JS class with common Color maths

    -----------
       usage
    -----------

    // hsv && hsl methods that start w/an underscore expect/return values like:
    // { h: 0-1, s: 0-1, v: 0-1 }
    // where as those that don't expect/return values like:
    // { h: 0-360, s: 0-100, v: 0-100 }

    Color.alpha2hex(a)
    Color.hex2alpha(hex)

    Color._hex2rgb(hex)
    Color.hex2rgb(hex)
    Color._hex2hsl(hex)
    Color.hex2hsl(hex)
    Color._hex2hsv(hex)
    Color.hex2hsv(hex)

    Color._rgb2hex(r, g, b)
    Color.rgb2hex(r, g, b)
    Color._rgb2hsl(r, g, b)
    Color.rgb2hsl(r, g, b)
    Color._rgb2hsv(r, g, b)
    Color.rgb2hsv(r, g, b)

    Color._hsl2hex(h, s, l)
    Color.hsl2hex(h, s, l)
    Color._hsl2rgb(h, s, l)
    Color.hsl2rgb(h, s, l)
    Color._hsl2hsv(h, s, l)
    Color.hsl2hsv(h, s, l)

    Color._hsv2hex(h, s, v)
    Color.hsv2hex(h, s, v)
    Color._hsv2rgb(h, s, v)
    Color.hsv2rgb(h, s, v)
    Color._hsv2hsl(h, s, v)
    Color.hsv2hsl(h, s, v)

    // normalize input to HSL or RGB
    Color.toHSL(value, defaults)
    Color.toRGB(value, defaults)

    // creates a random color string
    Color.random()

    // also accepts two optional arguments, type and alpha
    // type can be: 'hex', 'rgb', 'rgba', 'hsl' or 'hsla'
    // alpha can be a float value (0.0 - 1.0) or a boolean
    Color.random(type, alpha)

    // determines whether a hex or rgb color string is light or dark
    // returns true for light colors and false for dark colors
    Color.isLight(colorString)

    // WCAG contrast ratio between two colors
    Color.contrast(colorA, colorB)

    // create color schemes
    Color.scheme({ harmony, base, ...options })

    // match method takes a string and returns the first color string it finds
    // in the form of a parsed array (if no color is found it returns null)
    // for example:

    Color.match('color: rgba(34, 56, 88, 0.5); font-size: 23px;')
    // returns ["rgb", "rgba(34, 56, 88, 0.5)", "34", "56", "88", "0.5"]
*/
class Color {
  static alpha2hex (a) {
    const n = a * 255
    const v = n.toString(16)
    const h = v.split('.')[0]
    return (h.length === 1) ? `0${h}` : h
  }

  static hex2alpha (hex) {
    const v = parseInt(hex, 16) / 255
    return Math.round(v * 100) / 100
  }

  // ................................................................. HEX .....

  static _hex2rgb (hex) { // ('#ff0000') => { r: 1, g: 0, b: 0 }
    const o = this.hex2rgb(hex)
    return { r: o.r / 255, g: o.g / 255, b: o.b / 255 }
  }

  static hex2rgb (hex) { // ('#ff0000') => { r: 255, g: 0, b: 0 }
    if (hex.length === 9) hex = hex.substring(0, 7)
    else if (hex.length === 5) hex = hex.substring(0, 4)

    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b
    })

    const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return res ? {
      r: parseInt(res[1], 16),
      g: parseInt(res[2], 16),
      b: parseInt(res[3], 16)
    } : null
  }

  static _hex2hsl (hex) { // ('#ff0000') => { h: 0, s: 1, l: 0.5 }
    const c = this.hex2rgb(hex)
    return this._rgb2hsl(c.r / 255, c.g / 255, c.b / 255)
  }

  static hex2hsl (hex) { // ('#ff0000') => { h: 0, s: 100, l: 50 }
    if (hex.length === 9) hex = hex.substring(0, 7)
    else if (hex.length === 5) hex = hex.substring(0, 4)
    const c = this.hex2rgb(hex)
    return this.rgb2hsl(c.r, c.g, c.b)
  }

  static _hex2hsv (hex) { // ('#ff0000') => { h: 0, s: 1, v: 1 }
    const c = this.hex2rgb(hex)
    return this._rgb2hsv(c.r / 255, c.g / 255, c.b / 255)
  }

  static hex2hsv (hex) { // ('#ff0000') => { h: 0, s: 100, v: 100 }
    const c = this.hex2rgb(hex)
    return this.rgb2hsv(c.r, c.g, c.b)
  }

  // ................................................................. RGB .....

  static _rgb2hex (r, g, b) { // (1, 0, 0) => '#ff0000'
    r *= 255
    g *= 255
    b *= 255
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  static rgb2hex (r, g, b) { // (255, 0, 0) => '#ff0000'
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  static _rgb2hsl (r, g, b) { // (1, 0, 0) => { h: 0, s: 1, l: 0.5 }
    const c = this._rgb2hsv(r, g, b)
    return this._hsv2hsl(c.h, c.s, c.v)
  }

  static rgb2hsl (r, g, b) { // (255, 0, 0) => { h: 0, s: 100, l: 50 }
    const c = this._rgb2hsv(r / 255, g / 255, b / 255)
    const o = this._hsv2hsl(c.h, c.s, c.v)
    return {
      h: Math.round(o.h * 360),
      s: Math.round(o.s * 100),
      l: Math.round(o.l * 100)
    }
  }

  static _rgb2hsv (r, g, b) { // (1, 0, 0) => { h: 0, s: 1, v: 1 }
    r *= 255
    g *= 255
    b *= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const dif = max - min

    let h
    const s = max === 0 ? 0 : dif / max
    const v = max / 255

    switch (max) {
      case min: h = 0; break
      case r: h = (g - b) + dif * (g < b ? 6 : 0); h /= 6 * dif; break
      case g: h = (b - r) + dif * 2; h /= 6 * dif; break
      case b: h = (r - g) + dif * 4; h /= 6 * dif; break
    }

    return { h, s, v }
  }

  static rgb2hsv (r, g, b) { // (255, 0, 0) => { h: 0, s: 100, v: 100 }
    const c = this._rgb2hsv(r / 255, g / 255, b / 255)
    return {
      h: Math.round(c.h * 360),
      s: Math.round(c.s * 100),
      v: Math.round(c.v * 100)
    }
  }

  // ................................................................. HSL .....

  static _hsl2hex (h, s, l) { // (0, 1, 0.5) => '#ff0000'
    // const c = this._hsl2rgb(h, s, l)
    // return this._rgb2hex(c.r, c.g, c.b)
    const f = this._hsl2rgb(h, s, l)

    const toHex = x => {
      const hex = Math.round(x * 255).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }

    return `#${toHex(f.r)}${toHex(f.g)}${toHex(f.b)}`
  }

  static hsl2hex (h, s, l) { // (0, 100, 50) => '#ff0000'
    // const c = this.hsl2rgb(h, s, l)
    // return this.rgb2hex(c.r, c.g, c.b)
    h /= 360
    s /= 100
    l /= 100

    return this._hsl2hex(h, s, l)
  }

  static _hsl2rgb (h, s, l) { // (0, 1, 0.5) => { r: 1, g: 0, b: 0 }
    h = h * 360
    const a = s * Math.min(l, 1 - l)
    const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return { r: f(0), g: f(8), b: f(4) }
  }

  static hsl2rgb (h, s, l) { // (0, 100, 50) => { r: 255, g: 0, b: 0 }
    const scale = (num, inMin, inMax, outMin, outMax) => {
      return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
    }
    h = Math.round(scale(h, 0, 360, 0, 1) * 10) / 10
    s = Math.round(scale(s, 0, 100, 0, 1) * 10) / 10
    l = Math.round(scale(l, 0, 100, 0, 1) * 10) / 10

    const c = this._hsl2rgb(h, s, l)

    return {
      r: Math.ceil(c.r * 255),
      g: Math.ceil(c.g * 255),
      b: Math.ceil(c.b * 255)
    }
  }

  static _hsl2hsv (h, s, l) { // (0, 1, 0.5) => { h: 0, s: 1, v: 1 }
    l *= 2
    s *= (l <= 1) ? l : 2 - 1
    const v = (1 + s) / 2
    s = (2 * s) / (l + s)
    return { h, s, v }
  }

  static hsl2hsv (h, s, l) { // (0, 100, 50) => { h: 0, s: 100, v: 100 }
    h /= 360
    s /= 100
    l /= 100
    const c = this._hsl2hsv(h, s, l)
    return {
      h: Math.round(c.h * 360),
      s: Math.round(c.s * 100),
      v: Math.round(c.v * 100)
    }
  }

  // ................................................................. HSV ....

  static _hsv2hex (h, s, v) { // (0, 1, 1) => '#ff0000'
    const c = this._hsv2rgb(h, s, v)
    return this._rgb2hex(c.r, c.g, c.b)
  }

  static hsv2hex (h, s, v) { // (0, 100, 100) => '#ff0000'
    const c = this.hsv2rgb(h, s, v)
    return this.rgb2hex(c.r, c.g, c.b)
  }

  static _hsv2rgb (h, s, v) { // (0, 1, 1) => { r: 1, g: 0, b: 0 }
    let r, g, b
    const i = Math.floor(h * 6)
    const f = h * 6 - i
    const p = v * (1 - s)
    const q = v * (1 - f * s)
    const t = v * (1 - (1 - f) * s)
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break
      case 1: r = q; g = v; b = p; break
      case 2: r = p; g = v; b = t; break
      case 3: r = p; g = q; b = v; break
      case 4: r = t; g = p; b = v; break
      case 5: r = v; g = p; b = q; break
    }
    return { r, g, b }
  }

  static hsv2rgb (h, s, v) { // (0, 100, 100) => { r: 255, g: 0, b: 0 }
    h /= 360
    s /= 100
    v /= 100
    const c = this._hsv2rgb(h, s, v)
    return {
      r: Math.round(c.r * 255),
      g: Math.round(c.g * 255),
      b: Math.round(c.b * 255)
    }
  }

  static _hsv2hsl (h, s, v) { // (0, 1, 1) => { h: 0, s: 1, l: 0.5 }
    const l = (2 - s) * v / 2
    if (l !== 0) {
      if (l === 1) s = 0
      else if (l < 0.5) s = s * v / (l * 2)
      else s = s * v / (2 - l * 2)
    }
    return { h, s, l }
  }

  static hsv2hsl (h, s, v) { // (0, 100, 100) => { h: 0, s: 100, l: 50 }
    h /= 360
    s /= 100
    v /= 100
    const c = this._hsv2hsl(h, s, v)
    return {
      h: Math.round(c.h * 360),
      s: Math.round(c.s * 100),
      l: Math.round(c.l * 100)
    }
  }

  // normalize an input into HSL {h,s,l} with degrees/percent ranges
  static toHSL (value, defaults = {}) {
    const clamp = (n, min, max) => Math.min(max, Math.max(min, n))
    const normHue = h => ((h % 360) + 360) % 360

    if (typeof value === 'number') {
      return {
        h: normHue(value),
        s: typeof defaults.saturation === 'number' ? clamp(defaults.saturation, 0, 100) : 100,
        l: typeof defaults.lightness === 'number' ? clamp(defaults.lightness, 0, 100) : 50
      }
    }

    if (typeof value === 'string' && value) {
      const s = value.trim()
      if (s[0] === '#') return this.hex2hsl(s)
      const m = this.match(s)
      if (m) {
        const kind = m[0]
        if (kind === 'hex') return this.hex2hsl(m[1])
        if (kind === 'rgb') {
          const r = parseFloat(m[2]); const g = parseFloat(m[3]); const b = parseFloat(m[4])
          return this.rgb2hsl(r, g, b)
        }
        if (kind === 'hsl') {
          const h = parseFloat(m[2]); const S = parseFloat(m[3]); const L = parseFloat(m[4])
          return { h: normHue(h), s: clamp(S, 0, 100), l: clamp(L, 0, 100) }
        }
      }
    }

    if (value && typeof value === 'object') {
      if ('h' in value && 's' in value && 'l' in value) {
        return { h: normHue(value.h), s: clamp(value.s, 0, 100), l: clamp(value.l, 0, 100) }
      }
      if ('h' in value && 's' in value && 'v' in value) {
        const hsl = this.hsv2hsl(value.h, value.s, value.v)
        return { h: normHue(hsl.h), s: clamp(hsl.s, 0, 100), l: clamp(hsl.l, 0, 100) }
      }
      if ('r' in value && 'g' in value && 'b' in value) {
        return this.rgb2hsl(value.r, value.g, value.b)
      }
    }

    return { h: 0, s: 100, l: 50 }
  }

  // normalize an input into RGB {r,g,b} with 0-255 ranges
  static toRGB (value, defaults = {}) {
    if (typeof value === 'number' || (value && typeof value === 'object' && 'h' in value)) {
      const hsl = this.toHSL(value, defaults)
      return this.hsl2rgb(hsl.h, hsl.s, hsl.l)
    }
    if (typeof value === 'string' && value) {
      const s = value.trim()
      if (s[0] === '#') return this.hex2rgb(s)
      const m = this.match(s)
      if (m) {
        const kind = m[0]
        if (kind === 'hex') return this.hex2rgb(m[1])
        if (kind === 'rgb') {
          return { r: parseFloat(m[2]), g: parseFloat(m[3]), b: parseFloat(m[4]) }
        }
        if (kind === 'hsl') {
          const h = parseFloat(m[2]); const S = parseFloat(m[3]); const L = parseFloat(m[4])
          return this.hsl2rgb(h, S, L)
        }
      }
    }
    if (value && typeof value === 'object' && 'r' in value && 'g' in value && 'b' in value) {
      return { r: value.r, g: value.g, b: value.b }
    }
    // fallback: pure red
    return { r: 255, g: 0, b: 0 }
  }

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ random color  ~ ~ ~

  static random (type, alpha) {
    let r, g, b, h, s, l, a, hex
    const opac = type === 'rgba' || type === 'hsla'
    if (typeof alpha === 'number') {
      a = type === 'hex' ? this.alpha2hex(alpha) : alpha
    } else if (alpha === true || opac) {
      a = type === 'hex'
        ? Math.floor(Math.random() * 255).toString(16)
        : Math.round(Math.random() * 100) / 100
    }

    if (type === 'rgb' || type === 'rgba') {
      r = Math.floor(Math.random() * 255)
      g = Math.floor(Math.random() * 255)
      b = Math.floor(Math.random() * 255)
      if (a) {
        return `rgba(${r}, ${g}, ${b}, ${a})`
      } else {
        return `rgb(${r}, ${g}, ${b})`
      }
    } else if (type === 'hsl' || type === 'hsla') {
      h = Math.floor(Math.random() * 360)
      s = Math.floor(Math.random() * 100)
      l = Math.floor(Math.random() * 100)
      if (a) {
        return `hsla(${h}, ${s}%, ${l}%, ${a})`
      } else {
        return `hsl(${h}, ${s}%, ${l}%)`
      }
    } else {
      hex = `#${(Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6)}`
      return a ? hex + a : hex
    }
  }

  // Compute contrast ratio per WCAG between two colors (hex/rgb/hsl or objects)
  static contrast (a, b) {
    const rgbA = this.toRGB(a)
    const rgbB = this.toRGB(b)
    const toLin = (c) => {
      const v = c / 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    }
    const LA = 0.2126 * toLin(rgbA.r) + 0.7152 * toLin(rgbA.g) + 0.0722 * toLin(rgbA.b)
    const LB = 0.2126 * toLin(rgbB.r) + 0.7152 * toLin(rgbB.g) + 0.0722 * toLin(rgbB.b)
    const L1 = Math.max(LA, LB)
    const L2 = Math.min(LA, LB)
    return (L1 + 0.05) / (L2 + 0.05)
  }

  // via: https://awik.io/determine-color-bright-dark-using-javascript/
  static isLight (color) {
    // Variables for red, green, blue values
    let r, g, b
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {
      // If RGB --> store the red, green, blue values in separate variables
      color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)
      r = color[1]
      g = color[2]
      b = color[3]
    } else {
      // If hex --> Convert it to RGB: http://gist.github.com/983661
      color = +('0x' + color.slice(1).replace(color.length < 5 && /./g, '$&$&'))
      r = color >> 16
      g = color >> 8 & 255
      b = color & 255
    }

    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))

    // Using the HSP value, determine whether the color is light or dark
    return hsp > 127.5
  }

  static match (str) {
    const hexRegex = /#[a-f\d]{3}(?:[a-f\d]?|(?:[a-f\d]{3}(?:[a-f\d]{2})?)?)\b/
    const hex = str.match(hexRegex)
    const rgbRegex = /rgba?\((?:(25[0-5]|2[0-4]\d|1?\d{1,2}|(?:\d{1,2}|100)%),\s*(25[0-5]|2[0-4]\d|1?\d{1,2}|(?:\d{1,2}|100)%),\s*(25[0-5]|2[0-4]\d|1?\d{1,2}|(?:\d{1,2}|100)%)(?:,\s*((?:\d{1,2}|100)%|0(?:\.\d+)?|1))?|(25[0-5]|2[0-4]\d|1?\d{1,2}|(?:\d{1,2}|100)%)\s+(25[0-5]|2[0-4]\d|1?\d{1,2}|(?:\d{1,2}|100)%)\s+(25[0-5]|2[0-4]\d|1?\d{1,2}|(?:\d{1,2}|100)%)(?:\s+((?:\d{1,2}|100)%|0(?:\.\d+)?|1))?)\)/
    const rgb = str.match(rgbRegex)
    const hslRegex = /hsla?\((?:(-?\d+(?:deg|g?rad|turn)?),\s*((?:\d{1,2}|100)%),\s*((?:\d{1,2}|100)%)(?:,\s*((?:\d{1,2}|100)%|0(?:\.\d+)?|1))?|(-?\d+(?:deg|g?rad|turn)?)\s+((?:\d{1,2}|100)%)\s+((?:\d{1,2}|100)%)(?:\s+((?:\d{1,2}|100)%|0(?:\.\d+)?|1))?)\)/
    const hsl = str.match(hslRegex)
    if (hex) return ['hex', ...hex]
    else if (rgb) return ['rgb', ...rgb]
    else if (hsl) return ['hsl', ...hsl]
    else return null
  }

  // create color schemes based on harmony types
  // returns an array of hex color strings
  // API: Color.scheme({ harmony, base, ...options })
  static scheme (options = {}) {
    const t = (options.harmony || '').toLowerCase()
    const o = options || {}

    const clamp = (n, min, max) => Math.min(max, Math.max(min, n))
    const normHue = h => ((h % 360) + 360) % 360

    const base = this.toHSL(options.base, { saturation: o.saturation, lightness: o.lightness })
    const h0 = normHue(base.h)
    const s0 = ('saturation' in o) ? clamp(o.saturation, 0, 100) : clamp(base.s, 0, 100)
    const l0 = ('lightness' in o) ? clamp(o.lightness, 0, 100) : clamp(base.l, 0, 100)

    const includeBase = ('includeBase' in o) ? !!o.includeBase : true
    const count = typeof o.count === 'number' && o.count > 0 ? Math.floor(o.count) : undefined
    const angle = typeof o.angle === 'number' ? o.angle : 30 // for analogous
    const offset = typeof o.offset === 'number' ? o.offset : 30 // for split/compound

    // contrast handling options
    const cOpt = o.contrast != null ? o.contrast : o.minContrast
    const contrastMin = typeof cOpt === 'string' ? ((cOpt.toUpperCase() === 'AAA') ? 7 : 4.5) : (typeof cOpt === 'number' ? cOpt : null)
    const contrastAgainst = o.contrastAgainst || o.against
    const contrastStrategy = o.contrastStrategy || o.strategy || 'adjust' // 'adjust' | 'filter'
    const steps = (typeof o.steps === 'number' && o.steps > 0) ? Math.min(50, Math.floor(o.steps)) : 1

    const meetsContrast = (hex) => {
      if (!contrastMin || !contrastAgainst) return true
      return this.contrast(hex, contrastAgainst) >= contrastMin
    }

    const adjustForContrast = (hex) => {
      if (!contrastMin || !contrastAgainst) return hex
      if (meetsContrast(hex)) return hex
      const hsl = this.toHSL(hex)
      const tryDir = (dir) => {
        let low = dir === 'darker' ? 0 : hsl.l
        let high = dir === 'darker' ? hsl.l : 100
        let best = null
        for (let i = 0; i < steps; i++) {
          const mid = (low + high) / 2
          const testHex = this.hsl2hex(hsl.h, hsl.s, mid)
          const ok = this.contrast(testHex, contrastAgainst) >= contrastMin
          if (ok) {
            best = { l: mid, hex: testHex }
            if (dir === 'darker') high = mid; else low = mid
          } else {
            if (dir === 'darker') low = mid; else high = mid
          }
        }
        return best
      }
      const darker = tryDir('darker')
      const lighter = tryDir('lighter')
      if (!darker && !lighter) return hex
      if (darker && !lighter) return darker.hex
      if (!darker && lighter) return lighter.hex
      // choose the minimal lightness change
      return (Math.abs(darker.l - hsl.l) <= Math.abs(lighter.l - hsl.l)) ? darker.hex : lighter.hex
    }

    const push = (h, s = s0, l = l0, arr) => {
      let hex = this.hsl2hex(normHue(h), clamp(s, 0, 100), clamp(l, 0, 100))
      if (contrastMin && contrastAgainst) {
        if (contrastStrategy === 'adjust') {
          hex = adjustForContrast(hex)
        } else if (!meetsContrast(hex)) {
          return // skip if filtering
        }
      }
      ;(arr || res).push(hex)
    }

    const res = []

    if (t === 'random') {
      const n = count || 5
      for (let i = 0; i < n; i++) res.push(this.random('hex'))
      return res
    }

    if (t === 'analogous') {
      const n = count || 5
      // generate around base hue in steps of `angle`
      const start = includeBase ? -Math.floor((n - 1) / 2) : -Math.floor(n / 2)
      for (let i = 0; i < n; i++) {
        let idx = start + i
        if (!includeBase && idx >= 0) idx += 1 // skip base (0)
        push(h0 + idx * angle)
      }
      return res
    }

    if (t === 'monochromatic') {
      const n = count || 5
      const range = Array.isArray(o.lightnessRange) && o.lightnessRange.length === 2
        ? [clamp(o.lightnessRange[0], 0, 100), clamp(o.lightnessRange[1], 0, 100)]
        : [clamp(Math.max(0, l0 - 40), 0, 100), clamp(Math.min(100, l0 + 40), 0, 100)]
      for (let i = 0; i < n; i++) {
        const li = n === 1 ? l0 : range[0] + (range[1] - range[0]) * (i / (n - 1))
        push(h0, s0, li)
      }
      return res
    }

    if (t === 'shades') {
      const n = count || 5
      const range = Array.isArray(o.lightnessRange) && o.lightnessRange.length === 2
        ? [clamp(o.lightnessRange[0], 0, 100), clamp(o.lightnessRange[1], 0, 100)]
        : [10, 90]
      for (let i = 0; i < n; i++) {
        const li = n === 1 ? l0 : range[0] + (range[1] - range[0]) * (i / (n - 1))
        push(h0, s0, li)
      }
      return res
    }

    if (t === 'triad') {
      let hues = [h0, h0 + 120, h0 + 240]
      if (!includeBase) hues = hues.slice(1)
      if (count) hues = hues.slice(0, count)
      hues.forEach(h => push(h))
      return res
    }

    if (t === 'complementary') {
      let hues = [h0, h0 + 180]
      if (!includeBase) hues = hues.slice(1)
      if (count) hues = hues.slice(0, count)
      hues.forEach(h => push(h))
      return res
    }

    if (t === 'split-complementary' || t === 'split_complementary' || t === 'split') {
      let hues = [h0, h0 + 180 - offset, h0 + 180 + offset]
      if (!includeBase) hues = hues.slice(1)
      if (count) hues = hues.slice(0, count)
      hues.forEach(h => push(h))
      return res
    }

    if (t === 'square') {
      let hues = [h0, h0 + 90, h0 + 180, h0 + 270]
      if (!includeBase) hues = hues.slice(1)
      if (count) hues = hues.slice(0, count)
      hues.forEach(h => push(h))
      return res
    }

    if (t === 'compound') {
      let hues = [h0 - offset, h0, h0 + offset, h0 + 180 - offset, h0 + 180 + offset]
      if (!includeBase) hues = hues.filter(h => normHue(h) !== normHue(h0))
      if (count) hues = hues.slice(0, count)
      hues.forEach(h => push(h))
      return res
    }

    // default to analogous if unknown type
    const n = count || 5
    const start = includeBase ? -Math.floor((n - 1) / 2) : -Math.floor(n / 2)
    for (let i = 0; i < n; i++) {
      let idx = start + i
      if (!includeBase && idx >= 0) idx += 1
      push(h0 + idx * angle)
    }
    return res
  }
}

if (typeof module !== 'undefined') module.exports = Color
