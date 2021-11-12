function WebGl(canvas) {
    this.canvas = canvas;
    this.shaders = {};
    this.textures = {};

    this.context = this.canvas.getContext('webgl', { alpha: false });
    if(!this.context) {
        console.log("Could not get webgl context.");
        return false;
    }
}

WebGl.prototype.init = function() {
    let gl = this.context;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

WebGl.prototype.loadShader = function(id, type) {
    let gl = this.context;
    let shaderSource = document.getElementById(id).innerHTML;
    let shader = gl.createShader(type);

    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return false;
    }

    return shader;
}

WebGl.prototype.makeShader = function(id) {
    let gl = this.context;
    let vertShader = this.loadShader(id+'-vertex', gl.VERTEX_SHADER);
    let fragShader = this.loadShader(id+'-fragment', gl.FRAGMENT_SHADER);

    if(!vertShader || !fragShader) {
        return false;
    }

    let prog = gl.createProgram();
    gl.attachShader(prog, vertShader);
    gl.attachShader(prog, fragShader);
    gl.linkProgram(prog);

    if(!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.log(gl.getProgramInfoLog(prog));
        gl.deleteProgram(prog);
        return false;
    }

    this.shaders[id] = prog;
}



