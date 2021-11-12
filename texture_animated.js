function TextureAnimated(webgl, name, frame_width, frame_height, frame_count, speed) {
    this.webgl = webgl;
    this.name = name;

    this.frame_width = frame_width;
    this.frame_height = frame_height;
    this.frame_count = frame_count;
    this.speed = speed;
    this.frame_index = 0;
    this.last_updated = 0;

    this.texture = null;

    this.load();
}

TextureAnimated.prototype.getTex = function() {
    return this.texture.tex;
}

TextureAnimated.prototype.load = function() {
    let gl = this.webgl.context;

    var texSrc = new Image();
    texSrc.onload = function() {
        let tex = gl.createTexture();
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

TextureAnimated.prototype.update = function(time, delta) {
    if(time > (this.last_updated + this.speed )) {
        this.frame_index++;
        if(this.frame_index >= this.frame_count) {
            this.frame_index = 0;
        }

        this.last_updated = time;
    }
}

TextureAnimated.prototype.render = function(shader) {
    let gl = this.webgl.context;

    let tex_buffer = gl.createBuffer();

    let x_margin = (this.frame_index * this.frame_width) / (this.frame_width * this.frame_count);
    let x_width = this.frame_width / (this.frame_width * this.frame_count);

    gl.bindBuffer(gl.ARRAY_BUFFER, tex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x_margin, 0.0,
        x_margin+x_width, 0.0,
        x_margin, 1.0,
        x_margin+x_width, 1.0,
        x_margin, 1.0,
        x_margin+x_width, 0.0,
    ]), gl.STATIC_DRAW);

    vsTex = gl.getAttribLocation(shader, 'a_texcoord');
    fsTex = gl.getUniformLocation(shader, 'u_tex');

    gl.enableVertexAttribArray(vsTex);
    gl.bindBuffer(gl.ARRAY_BUFFER, tex_buffer);
    gl.vertexAttribPointer(vsTex, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1i(fsTex, 0);
}
