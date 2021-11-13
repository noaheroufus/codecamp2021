function Game(canvas, width, height, units) {
    this.canvas = canvas;
    this.units = units;
    this.width = width * this.units;
    this.height = height * this.units;

    this.running = false;
    this.last = 0;
    this.keys = [];
    this.mouse_x = 0;
    this.mouse_y = 0;
    this.mouse_attack = false;

    this.objects = [];

    this.state = new GameState();
}

Game.prototype.init = function() {
    // Event listeners
    this.canvas.addEventListener('mousedown', function(ev) {
        if(ev.button == 0) {
            this.mouse_attack = true;
        }
    }.bind(this));
    this.canvas.addEventListener('mouseup', function(ev) {
        if(ev.button == 0) {
            this.mouse_attack = false;
        }
    }.bind(this));
    this.canvas.addEventListener('mousemove', function(ev) {
        this.mouse_x = Math.max(0, Math.min(ev.offsetX, this.width));
        this.mouse_y = Math.max(0, Math.min(ev.offsetY, this.height));
    }.bind(this));

    document.addEventListener('keydown', function(ev) {
        let c = ev.keyCode;
        let i = this.keys.indexOf(c);
        if(i < 0) {
            // Push the key to the table if it's not already there
            this.keys.push(c);
        }
    }.bind(this));
    document.addEventListener('keyup', function(ev) {
        let c = ev.keyCode;
        let i = this.keys.indexOf(c);
        if(i >= 0) {
            // Remove the key from the table if it's not already there
            this.keys.splice(i, 1);
        }
    }.bind(this));

    // Set the canvas size
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Initialize WebGL
    this.webgl = new WebGl(this.canvas);
    this.webgl.init();

    // Load textures
    LoadTextures(this.webgl);

    // Build our shaders
    this.webgl.makeShader('main');

    // Set our game state to the title screen
    // (state.type, callback)
    this.state.changeState(this.state.title, this.prepareTitle.bind(this));

    // Start the game loop
    window.requestAnimationFrame(this.loop.bind(this));
}

Game.prototype.update = function(time, delta) {

    // Title-screen specific logic
    if(this.state.getState() == this.state.title) {
        if(this.mouse_attack) { // left click for now
            this.state.changeState(this.state.playing, this.preparePlay.bind(this));
        }
    }

    // Update all our objects.
    this.objects.forEach(function(obj, idx) {
        obj.update(time, delta);
    });
}

Game.prototype.render = function() {
    let gl = this.webgl.context;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Render all our objects.
    this.objects.forEach(function(obj, idx) {
        obj.render();
    });
}

Game.prototype.loop = function(ts) {
    let delta = ts - this.last;

    this.update(ts, delta);
    this.render();

    this.last = ts;

    window.requestAnimationFrame(this.loop.bind(this));
}

Game.prototype.keyPressed = function(keyCode) {
    return (this.keys.indexOf(keyCode) >= 0);
}

Game.prototype.prepareTitle= function() {
    // Add our title screen objects
    // TODO
}

Game.prototype.preparePlay= function() {
    // Prevent attacking right away
    this.mouse_attack = false;

    // Add our player object to the game.
    this.objects.push(new PlayerObject(this.webgl, ( this.width / 2 ) - ( ( this.units*4 ) / 2), this.height - this.units*4, 4, 4));
}

Game.prototype.prepareDead= function() {
    // Add our dead state objects
    // TODO
}

