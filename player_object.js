let player_object = Object.assign({}, game_object);

player_object.width = gInfo.units * 2;
player_object.height = gInfo.units * 4;

player_object.x = (gInfo.width/2) - (player_object.width/2);
player_object.y = gInfo.height - player_object.height - gInfo.units;

player_object.name = "Player";

// Override the update function
player_object.update = function(delta) {
    // Reference the 'super' update function.
    this.parentUpdate(delta);

    // Up
    if(keyPressed(188)) {
       this.y -= this.speed * delta;
    }
    // Down
    if(keyPressed(79)) {
       this.y += this.speed * delta;
    }
    // Right
    if(keyPressed(69)) {
       this.x += this.speed * delta;
    }
    // Left
    if(keyPressed(65)) {
       this.x -= this.speed * delta;
    }

    // Keep the player location in screen bounds.
    this.keepInBounds();
}

player_object.render = function() {
    // Refence the 'super' render function.
    this.parentRender();
}
