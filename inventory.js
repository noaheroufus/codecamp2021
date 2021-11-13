function Inventory() {
    this.width = game.units * 32;
    this.height = game.units * 4;

    this.x = (game.width / 2) - (this.width / 2);
    this.y = game.units;

    this.texture = TEXTURES[INV_BAR];

    this.slots = 8;
    this.items = [];

    this.items.push(new InventoryItem(this, TEXTURES[ITEM_EXTENDER]));
    this.items.push(new InventoryItem(this, TEXTURES[ITEM_PASSCHANGE]));
    this.items.push(new InventoryItem(this, TEXTURES[ITEM_POWER]));
    this.items.push(new InventoryItem(this, TEXTURES[ITEM_CHANCHANGE]));
}

Inventory.prototype.update = function(delta, time) {

}

Inventory.prototype.render = function() {
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

    // Draw Items
    this.items.forEach(function(obj, idx) {
        obj.render(game.webgl.shaders['main'], idx+1);
    }.bind(this));
}
