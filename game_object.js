let game_object = {
    // Positioning values
    x: 0,
    y: 0,
    width: gInfo.units * 4,
    height: gInfo.units * 4,
    speed: 0.5,

    // Meta values
    name: "base",
    color: {
        r: 15,
        g: 255,
        b: 15,
        a: 255
    },

    keepInBounds: function() {
        if(this.x < 0) this.x = 0;
        if(this.x >= gInfo.width-this.width) this.x = gInfo.width - this.width;

        if(this.y < 0) this.y = 0;
        if(this.y >= gInfo.height-this.height) this.y = gInfo.height - this.height;
    },

    // Default methods
    parentUpdate: function(delta) {
        // TODO
    },

    parentRender: function() {
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
        gl.useProgram(shaders['main']);

        // Set shader variables
        let shaderPos = gl.getAttribLocation(shaders['main'], 'a_position');
        let shaderSize = gl.getUniformLocation(shaders['main'], 'u_screensize');
        let shaderColor = gl.getUniformLocation(shaders['main'], 'u_color');

        // Send the object position
        gl.enableVertexAttribArray(shaderPos);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(shaderPos, 2, gl.FLOAT, false, 0, 0);

        // Send the screen bounds
        gl.uniform2fv(shaderSize, [ gInfo.width, gInfo.height ]);

        // Send the color
        gl.uniform4fv(shaderColor, [
            this.color.r,
            this.color.g,
            this.color.b,
            this.color.a
        ]);

        // Draw it
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    },

    overrideUpdate: function() {
    },
    overrideRender: function() {
    }
};
