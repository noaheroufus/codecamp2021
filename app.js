let gInfo = {};
gInfo.units = 16;
gInfo.width = gInfo.units * 64;
gInfo.height = gInfo.units * 48;

let running = false;
let canvas = null;
let gl = null;
let lastRender = 0;

let shaders = {};
let keys = [];
let objects = [];

// HTML DOM ready
function onload() {
    // Get the WebGL context
    canvas = document.getElementById('game');
    gl = canvas.getContext('webgl', { alpha: false });
    if(!gl) {
        return;
    }

    // Set the canvas size
    canvas.width = gInfo.width;
    canvas.height = gInfo.height;

    // Setup game
    setup();
}

function setup() {
    // Setup GL
    gl.viewport(0, 0, gInfo.width, gInfo.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Load shaders
    makeShader('main');

    // Create game objects
        // Player
        objects.push(Object.assign({}, player_object));

    // Start game loop
    running = true;
    window.requestAnimationFrame(loop);
}

function update(delta) {
    objects.forEach(function(obj, idx) {
        obj.update(delta);
    });
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    objects.forEach(function(obj, idx) {
        obj.render();
    });
}

function loop(t) {
    // Break out of the animation loop if we're no longer 'running'.
    if(!running) {
        return;
    }

    let delta = t - lastRender;

    update(delta);
    render();

    lastRender = t;

    // Request a new draw
    window.requestAnimationFrame(loop);
}

function loadShader(id, type) {
    let shaderSource = document.getElementById(id).innerHTML;
    let shader = gl.createShader(type);

    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return false;
    }

    return shader;
}

function makeShader(id) {
    let vertShader = loadShader(id+'-vertex', gl.VERTEX_SHADER);
    let fragShader = loadShader(id+'-fragment', gl.FRAGMENT_SHADER);

    if(!vertShader || !fragShader) {
        return false;
    }

    let prog = gl.createProgram();
    gl.attachShader(prog, vertShader);
    gl.attachShader(prog, fragShader);
    gl.linkProgram(prog);

    if(!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.log(gl.getProgramInfoLog(prog));
        gl.deleteProgram(prog);
        return false;
    }

    shaders[id] = prog;
    return true;
}

function keyPressed(keyCode) {
    return (keys.indexOf(keyCode) >= 0);
}

document.addEventListener('keydown', function(ev) {
    let c = ev.keyCode;
    let i = keys.indexOf(c);
    if(i < 0) {
        // Push the key to the table if it's not already there
        keys.push(c);
    }
});
document.addEventListener('keyup', function(ev) {
    let c = ev.keyCode;
    let i = keys.indexOf(c);
    if(i >= 0) {
        // Remove the key from the table if it's not already there
        keys.splice(i, 1);
    }
});

