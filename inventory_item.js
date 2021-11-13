function InventoryItem(inv, item_data) {
    this.width = game.units * 3;
    this.height = game.units * 3;

    this.padding_left = 8;

    this.inv = inv;
    this.version = item_data;
    this.item_data = TEXTURES[item_data];
}

InventoryItem.prototype.update = function(time, delta) {

}

InventoryItem.prototype.render = function(shader, slot) {
    let gl = game.webgl.context;

    let x = this.inv.x + (game.units+1) + ( (slot-1) * (46 + game.units));
    let y = (this.inv.y) + (game.units / 2);

    // Buffer vertexes for a basic square matching the dimensions of this object
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x, y,
        x+this.width, y,
        x, y+this.height,
        x+this.width, y+this.height
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

    if(this.item_data.texture) {
        this.item_data.render(game.webgl.shaders['main']);
    }

    // Send the screen bounds
    gl.uniform2fv(shaderSize, [ game.width, game.height ]);

    // Send the color
    gl.uniform4fv(shaderColor, [ 255, 255, 255, 255 ]);

    // Draw it
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

}
