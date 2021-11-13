function TitleScreen() {
    this.width = game.units * 62;
    this.height = game.units * 24;

    this.x = (game.width / 2) - (this.width / 2);
    this.y = (game.height / 2) - (this.height / 2);

    this.texture = TEXTURES[SCREEN_TITLE];
}

TitleScreen.prototype.update = function(delta, time) {

}

TitleScreen.prototype.render = function() {
    let gl = game.webgl.context;

    // Buffer vertexes for a basic square matching the dimensions of this object
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        this.x, this.y,
        this.x+this.width, this.y,
        this.x, this.y+this.height,
        this.x+this.width, this.y+this.height
    ]), gl.STATIC_DRAW);

    // Buffer indicies
    let idx_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idx_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([
        0, 1, 2,
        2, 1, 3
    ]), gl.STATIC_DRAW);

    // Use the shader
    gl.useProgram(game.webgl.shaders['main']);

    // Set shader variables
    let shaderPos = gl.getAttribLocation(game.webgl.shaders['main'], 'a_position');
    let shaderSize = gl.getUniformLocation(game.webgl.shaders['main'], 'u_screensize');
    let shaderColor = gl.getUniformLocation(game.webgl.shaders['main'], 'u_color');

    // Send the object position
    gl.enableVertexAttribArray(shaderPos);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(shaderPos, 2, gl.FLOAT, false, 0, 0);

    if(this.texture) {
        this.texture.render(game.webgl.shaders['main']);
    }

    // Send the screen bounds
    gl.uniform2fv(shaderSize, [ game.width, game.height ]);

    // Send the color
    gl.uniform4fv(shaderColor, [ 255, 255, 255, 255 ]);

    // Draw it
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}
