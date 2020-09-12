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

    Color.hex2rgb(hex)
    Color.hex2hsl(hex)
    Color._hex2hsl(hex)
    Color.hex2hsv(hex)
    Color._hex2hsv(hex)

    Color.rgb2hex(r, g, b)
    Color.rgb2hsv(r, g, b)
    Color._rgb2hsv(r, g, b)
    Color.rgb2hsl(r, g, b)
    Color._rgb2hsl(r, g, b)

    Color.hsv2hex(h, s, v)
    Color._hsv2hex(h, s, v)
    Color.hsv2rgb(h, s, v)
    Color._hsv2rgb(h, s, v)
    Color.hsv2hsl(h, s, v)
    Color._hsv2hsl(h, s, v)

    Color.hsl2hex(h, s, l)
    Color._hsl2hex(h, s, l)
    Color.hsl2rgb(h, s, l)
    Color._hsl2rgb(h, s, l)
    Color.hsl2hsv(h, s, l)
    Color._hsl2hsv(h, s, l)

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
    return v.split('.')[0]
  }

  static hex2alpha (hex) {
    return parseInt(hex, 16) / 255
  }

  static hex2rgb (hex) {
    if (hex.length === 9) hex = hex.substring(7, 9)
    else if (hex.length === 5) hex = hex.substring(4, 5)

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

  static hex2hsl (hex) {
    if (hex.length === 9) hex = hex.substring(7, 9)
    else if (hex.length === 5) hex = hex.substring(4, 5)
    const c = this.hex2rgb(hex)
    return this.rgb2hsl(c.r, c.g, c.b)
  }

  static _hex2hsl (hex) {
    const c = this.hex2rgb(hex)
    return this._rgb2hsl(c.r, c.g, c.b)
  }

  static hex2hsv (hex) {
    const c = this.hex2rgb(hex)
    return this.rgb2hsv(c.r, c.g, c.b)
  }

  static _hex2hsv (hex) {
    const c = this.hex2rgb(hex)
    return this._rgb2hsv(c.r, c.g, c.b)
  }

  static rgb2hsv (r, g, b) {
    const c = this._rgb2hsv(r, g, b)
    return {
      h: Math.round(c.h * 360),
      s: Math.round(c.s * 100),
      v: Math.round(c.v * 100)
    }
  }

  static rgb2hsl (r, g, b) {
    const c = this._rgb2hsv(r, g, b)
    const o = this._hsv2hsl(c.h, c.s, c.v)
    return {
      h: Math.round(o.h * 360),
      s: Math.round(o.s * 100),
      l: Math.round(o.l * 100)
    }
  }

  static rgb2hex (r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  static hsv2hex (h, s, v) {
    const c = this.hsv2rgb(h, s, v)
    return this.rgb2hex(c.r, c.g, c.b)
  }

  static hsv2hsl (h, s, v) {
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

  static hsv2rgb (h, s, v) {
    h /= 360
    s /= 100
    v /= 100
    return this._hsv2rgb(h, s, v)
  }

  static hsl2hex (h, s, l) {
    const c = this.hsl2rgb(h, s, l)
    return this.rgb2hex(c.r, c.g, c.b)
  }

  static hsl2rgb (h, s, l) {
    h /= 360
    s /= 100
    l /= 100
    const c = this._hsl2hsv(h, s, l)
    return this._hsv2rgb(c.h, c.s, c.v)
  }

  static hsl2hsv (h, s, l) {
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

  static _hsv2hsl (h, s, v) {
    s = s * v
    let l = (2 - s) * v
    s /= (l <= 1) ? l : 2 - l
    l /= 2
    return { h, s, l }
  }

  static _hsl2hsv (h, s, l) {
    l *= 2
    s *= (l <= 1) ? l : 2 - 1
    const v = (1 + s) / 2
    s = (2 * s) / (l + s)
    return { h, s, v }
  }

  static _hsl2rgb (h, s, l) {
    const c = this._hsl2hsv(h, s, l)
    return this._hsv2rgb(c.h, c.s, c.v)
  }

  static _hsl2hex (h, s, l) {
    const c = this._hsl2rgb(h, s, l)
    return this.rgb2hex(c.r, c.g, c.b)
  }

  static _rgb2hsv (r, g, b) {
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

  static _rgb2hsl (r, g, b) {
    const c = this._rgb2hsv(r, g, b)
    return this._hsv2hsl(c.h, c.s, c.v)
  }

  static _hsv2hex (h, s, v) {
    const c = this._hsv2rgb(h, s, v)
    return this.rgb2hex(c.r, c.g, c.b)
  }

  static _hsv2rgb (h, s, v) {
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
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    }
  }

  // ~ ~ ~

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
}

if (typeof module !== 'undefined') module.exports = Color
