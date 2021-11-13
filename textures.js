let TEXTURES = [];

const PLAYER_IDLE = 0;
const PLAYER_ATTACK = 1;
const TREE_1 = 2;
const TREE_2 = 3;
const TREE_3 = 4;
const INV_BAR = 5;
const ITEM_EXTENDER = 6;

function LoadTextures(webgl) {
    // Player
    TEXTURES[PLAYER_IDLE] = new TextureAnimated(webgl, PLAYER_IDLE, "./images/Player_Idle.png", 32, 32, 4, (1000/6), false);
    TEXTURES[PLAYER_ATTACK] = new TextureAnimated(webgl, PLAYER_ATTACK, "./images/Player_Attack.png", 32, 32, 4, (1000/6), true);

    // Trees
    TEXTURES[TREE_1] = new Texture(webgl, TREE_1, "./images/Trees.png", 512, 128, 128, 128, 0, 0);
    TEXTURES[TREE_2] = new Texture(webgl, TREE_2, "./images/Trees.png", 512, 128, 128, 128, 1, 0);
    TEXTURES[TREE_3] = new Texture(webgl, TREE_3, "./images/Trees.png", 512, 128, 128, 128, 2, 0);

    // Inventory
    TEXTURES[INV_BAR] = new Texture(webgl, INV_BAR, "./images/Inventory.png", 264, 34, 264, 34, 0, 0);
    TEXTURES[ITEM_EXTENDER] = new Texture(webgl, ITEM_EXTENDER, "./images/Tools.png", 128, 32, 32, 32, 0, 0);
}
