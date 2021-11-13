function Texture(webgl, id, name, width, height, frame_width, frame_height, offset_x, offset_y) {
    this.webgl = webgl;
    this.id = id;
    this.name = name;
    this.width = width;
    this.height = height;
    this.frame_width = frame_width;
    this.frame_height = frame_height;
    this.offset_x = offset_x;
    this.offset_y = offset_y;
    this.texture = null;

    this.ready = false;

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
        gl.activeTexture(gl.TEXTURE0+this.id);
        gl.bindTexture(gl.TEXTURE_2D, tex);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texSrc);

        this.texture = {tex: tex, width: this.width, height: this.height};
        this.ready = true;
    }.bind(this);
    texSrc.src = this.name;
}

Texture.prototype.update = function(time, delta, owner) {
}

Texture.prototype.render = function(shader) {
    if(!this.ready) return;

    let gl = this.webgl.context;

    let tex_buffer = gl.createBuffer();

    let x_margin = (this.offset_x * this.frame_width) / this.texture.width;
    let x_width = this.frame_width / this.texture.width;
    let y_margin = (this.offset_y * this.frame_height) / this.texture.height;
    let y_height = this.frame_height / this.texture.height;

    gl.bindBuffer(gl.ARRAY_BUFFER, tex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x_margin, y_margin,
        x_margin+x_width, y_margin,
        x_margin, y_margin+y_height,
        x_margin+x_width, y_margin+y_height,
        x_margin, y_margin+y_height,
        x_margin+x_width, y_margin,
    ]), gl.STATIC_DRAW);

    vsTex = gl.getAttribLocation(shader, 'a_texcoord');
    fsTex = gl.getUniformLocation(shader, 'u_tex');

    gl.enableVertexAttribArray(vsTex);
    gl.bindBuffer(gl.ARRAY_BUFFER, tex_buffer);
    gl.vertexAttribPointer(vsTex, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1i(fsTex, this.id);
}
