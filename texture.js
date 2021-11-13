function Texture(webgl, id, name) {
    this.webgl = webgl;
    this.id = id;
    this.name = name;
    this.texture = null;

    this.load();
}

Texture.prototype.getTex = function() {
    return this.texture.tex;
}

Texture.prototype.load = function() {
    let gl = this.webgl.context;

    var texSrc = new Image();
    texSrc.onload = function() {
        let tex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE+this.id);
        gl.bindTexture(gl.TEXTURE_2D, tex);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texSrc);

        this.texture = {tex: tex, width: this.width, height: this.height};
    }.bind(this);
    texSrc.src = this.name;
}

Texture.prototype.render = function(shader) {
    let gl = this.webgl.context;

    let tex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        1.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
    ]), gl.STATIC_DRAW);

    vsTex = gl.getAttribLocation(shader, 'a_texcoord');
    fsTex = gl.getUniformLocation(shader, 'u_tex');

    gl.enableVertexAttribArray(vsTex);
    gl.bindBuffer(gl.ARRAY_BUFFER, tex_buffer);
    gl.vertexAttribPointer(vsTex, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1i(fsTex, this.id);
}
