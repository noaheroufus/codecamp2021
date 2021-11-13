let TEXTURES = [];

const PLAYER_IDLE = 0;
const PLAYER_ATTACK = 1;

function LoadTextures(webgl) {
    // Player
    TEXTURES[PLAYER_IDLE] = new TextureAnimated(webgl, PLAYER_IDLE, "./images/Player_Idle.png", 32, 32, 4, (1000/6), false);
    TEXTURES[PLAYER_ATTACK] = new TextureAnimated(webgl, PLAYER_ATTACK, "./images/Player_Attack.png", 32, 32, 4, (1000/6), true);

    //
}
