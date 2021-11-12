function Game(canvas, width, height, units) {
    this.canvas = canvas;
    this.units = units;
    this.width = width * this.units;
    this.height = height * this.units;

    this.running = false;
    this.last = 0;
    this.keys = [];

    this.objects = [];
}

Game.prototype.init = function() {
    // Set the canvas size
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Initialize WebGL
    this.webgl = new WebGl(this.canvas);
    this.webgl.init();

    // Build our shaders
    this.webgl.makeShader('main');

    // Add our game objects
    this.objects.push(new PlayerObject(this.webgl, 0, 0, 4, 4));

    // Start the game loop
    window.requestAnimationFrame(this.loop.bind(this));
}

Game.prototype.update = function(delta) {
    this.objects.forEach(function(obj, idx) {
        obj.update(delta);
    });
}

Game.prototype.render = function() {
    let gl = this.webgl.context;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.objects.forEach(function(obj, idx) {
        obj.render();
    });
}

Game.prototype.loop = function(ts) {
    let delta = ts - this.last;

    this.update(delta);
    this.render();

    this.last = ts;

    window.requestAnimationFrame(this.loop.bind(this));
}

Game.prototype.keyPressed = function(keyCode) {
    return (this.keys.indexOf(keyCode) >= 0);
}

document.addEventListener('keydown', function(ev) {
    let c = ev.keyCode;
    let i = game.keys.indexOf(c);
    if(i < 0) {
        // Push the key to the table if it's not already there
        game.keys.push(c);
    }
});
document.addEventListener('keyup', function(ev) {
    let c = ev.keyCode;
    let i = game.keys.indexOf(c);
    if(i >= 0) {
        // Remove the key from the table if it's not already there
        game.keys.splice(i, 1);
    }
});


