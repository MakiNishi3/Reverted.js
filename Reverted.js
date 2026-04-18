var Reverted = {};

Reverted.add = function(a, b) {
  return a + b;
};

Reverted.slider = function(min, max, value) {
  var v = value;
  return {
    min: min,
    max: max,
    get: function() {
      return v;
    },
    set: function(n) {
      if (n < min) n = min;
      if (n > max) n = max;
      v = n;
    }
  };
};

Reverted.enum = function(values, current) {
  var v = current || values[0];
  return {
    values: values,
    get: function() {
      return v;
    },
    set: function(n) {
      if (values.indexOf(n) !== -1) v = n;
    }
  };
};

Reverted.boolean = function(initial) {
  var v = !!initial;
  return {
    get: function() {
      return v;
    },
    toggle: function() {
      v = !v;
    },
    set: function(n) {
      v = !!n;
    }
  };
};

Reverted.color = function(r, g, b, a) {
  return {
    r: r || 0,
    g: g || 0,
    b: b || 0,
    a: a === undefined ? 1 : a,
    toArray: function() {
      return [this.r, this.g, this.b, this.a];
    },
    toCSS: function() {
      return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    }
  };
};

var webgl = (function() {
  var canvas = document.createElement("canvas");
  var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  return gl;
})();

var createShader = function(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
};

Reverted.createShader = function(vertexSource, fragmentSource) {
  var gl = webgl;
  var vs = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  var fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  var program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  return program;
};

var shader = null;

var pixels = function(gl, width, height) {
  var buffer = new Uint8Array(width * height * 4);
  return {
    width: width,
    height: height,
    data: buffer,
    setPixel: function(x, y, r, g, b, a) {
      var i = (y * width + x) * 4;
      buffer[i] = r;
      buffer[i + 1] = g;
      buffer[i + 2] = b;
      buffer[i + 3] = a;
    },
    getPixel: function(x, y) {
      var i = (y * width + x) * 4;
      return [
        buffer[i],
        buffer[i + 1],
        buffer[i + 2],
        buffer[i + 3]
      ];
    }
  };
};

var supportedtypes = [".MP4", ".PNG", ".jpg", ".png", ".jpeg", ".mov"];

var uploadimageandvideo = function(file, callback) {
  var name = file.name;
  var ext = name.substring(name.lastIndexOf("."));
  if (supportedtypes.indexOf(ext) === -1) return;
  var url = URL.createObjectURL(file);
  var element;
  if (ext.toLowerCase() === ".mp4" || ext.toLowerCase() === ".mov") {
    element = document.createElement("video");
    element.src = url;
    element.autoplay = true;
    element.loop = true;
    element.muted = true;
    element.onloadeddata = function() {
      callback(element);
    };
  } else {
    element = new Image();
    element.src = url;
    element.onload = function() {
      callback(element);
    };
  }
};

Reverted.shader = function(vs, fs) {
  shader = Reverted.createShader(vs, fs);
  return shader;
};

Reverted.webgl = webgl;
Reverted.pixels = pixels;
Reverted.createShaderRaw = createShader;
Reverted.uploadimageandvideo = uploadimageandvideo;
Reverted.supportedtypes = supportedtypes;

if (typeof exports !== "undefined") {
  exports.Reverted = Reverted;
                                 }
