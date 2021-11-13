function GameState() {
    this.loading    = -1;
    this.dead       = 0;
    this.title      = 1;
    this.playing    = 2;
    this.reveal     = 3;
    this.fight      = 4;
    this.slay       = 5;
    this.victory    = 6;

    this.current_state = this.loading;
}

GameState.prototype.getState = function() {
    return this.current_state;
}

GameState.prototype.changeState = function(state, callback) {
    this.current_state = state;

    game.objects = [];

    callback();
}
