let game = false;

// HTML DOM ready
function onload() {
    // Get the WebGL context
    canvas = document.getElementById('game');

    // <canvas/>, width, height, units
    // width,height will be multiplied by units internally
    game = new Game(canvas, 64, 48, 16);
    game.init();
}

