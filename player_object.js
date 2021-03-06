function PlayerObject(webgl, x, y, width, height) {
    this.webgl = webgl;

    this.x = x;
    this.y = y;
    this.width = width * game.units;
    this.height = height * game.units;

    this.speed = 0.10;
    this.walking = false;
    this.attacking = false;
    this.performing_action = false;

    this.is_player = true;
    this.color = {r: 255, g: 255, b: 255, a: 255};

    //this.texture = new Texture(this.webgl, "./images/Player_Idle.png");
    this.texture = TEXTURES[PLAYER_IDLE];
}

PlayerObject.prototype.keepInBounds = function() {
    if(this.x < 0) this.x = 0;
    if(this.x >= game.width-this.width) this.x = game.width - this.width;

    if(this.y < 0) this.y = 0;
    if(this.y >= game.height-this.height) this.y = game.height - this.height;
}

PlayerObject.prototype.update = function(time, delta) {
    this.walking = false;

    // Up
    if(game.keyPressed(188)) {
        this.walking = true;
        this.y -= this.speed * delta;
    }
    // Down
    if(game.keyPressed(79)) {
        this.walking = true;
        this.y += this.speed * delta;
    }
    // Right
    if(game.keyPressed(69)) {
        this.walking = true;
        this.x += this.speed * delta;
    }
    // Left
    if(game.keyPressed(65)) {
        this.walking = true;
        this.x -= this.speed * delta;
    }


    if(game.state.getState() == game.state.playing) {
        if(!this.performing_action && game.mouse_attack) {
            this.attack();
        }
    }

    this.keepInBounds();

    if(this.texture) {
        this.texture.update(time, delta, this);
    }

}

PlayerObject.prototype.render = function() {
    let gl = this.webgl.context;

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
    gl.useProgram(this.webgl.shaders['main']);

    // Set shader variables
    let shaderPos = gl.getAttribLocation(this.webgl.shaders['main'], 'a_position');
    let shaderSize = gl.getUniformLocation(this.webgl.shaders['main'], 'u_screensize');
    let shaderColor = gl.getUniformLocation(this.webgl.shaders['main'], 'u_color');

    // Send the object position
    gl.enableVertexAttribArray(shaderPos);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(shaderPos, 2, gl.FLOAT, false, 0, 0);

    if(this.texture) {
        this.texture.render(this.webgl.shaders['main']);
    }

    // Send the screen bounds
    gl.uniform2fv(shaderSize, [ game.width, game.height ]);

    // Send the color
    gl.uniform4fv(shaderColor, [
        this.color.r,
        this.color.g,
        this.color.b,
        this.color.a
    ]);

    // Draw it
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}

PlayerObject.prototype.attack = function() {
    this.texture = TEXTURES[PLAYER_ATTACK];
    this.texture.frame_index = 1; // Reset to 1

    this.performing_action = true;
    this.attacking = true;
}

PlayerObject.prototype.idle = function() {
    this.texture = TEXTURES[PLAYER_IDLE];
    this.texture.frame_index = 1; // Reset to 1

    this.performing_action = false;
    this.attacking = false;
}

