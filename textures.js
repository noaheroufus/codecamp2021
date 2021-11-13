let TEXTURES = [];

const PLAYER_IDLE = 0;
const PLAYER_ATTACK = 1;
const TREE_1 = 2;
const TREE_2 = 3;
const TREE_3 = 4;
const SHRUB_1 = 5;
const SHRUB_2 = 6;
const SHRUB_3 = 7;
const SHRUB_4 = 8;
const SHRUB_5 = 9;
const SHRUB_6 = 10;
const SHRUB_7 = 11;
const SHRUB_8 = 12;
const INV_BAR = 13;
const ITEM_EXTENDER = 14;

function LoadTextures(webgl) {
    // Player
    TEXTURES[PLAYER_IDLE] = new TextureAnimated(webgl, PLAYER_IDLE, "./images/Player_Idle.png", 32, 32, 4, (1000/6), false);
    TEXTURES[PLAYER_ATTACK] = new TextureAnimated(webgl, PLAYER_ATTACK, "./images/Player_Attack.png", 32, 32, 4, (1000/6), true);

    // Trees
    TEXTURES[TREE_1] = new Texture(webgl, TREE_1, "./images/Trees.png", 512, 128, 128, 128, 0, 0);
    TEXTURES[TREE_2] = new Texture(webgl, TREE_2, "./images/Trees.png", 512, 128, 128, 128, 1, 0);
    TEXTURES[TREE_3] = new Texture(webgl, TREE_3, "./images/Trees.png", 512, 128, 128, 128, 2, 0);

    // Inventory
    TEXTURES[INV_BAR] = new Texture(webgl, INV_BAR, "./images/Toolbar.png", 271, 41, 271, 41, 0, 0);
    TEXTURES[ITEM_EXTENDER] = new Texture(webgl, ITEM_EXTENDER, "./images/Tools.png", 128, 32, 32, 32, 0, 0);

    // Shrubs
    TEXTURES[SHRUB_1] = new Texture(webgl, SHRUB_1, "./images/Shrubs.png", 256, 32, 32, 32, 0, 0);
    TEXTURES[SHRUB_2] = new Texture(webgl, SHRUB_2, "./images/Shrubs.png", 256, 32, 32, 32, 1, 0);
    TEXTURES[SHRUB_3] = new Texture(webgl, SHRUB_3, "./images/Shrubs.png", 256, 32, 32, 32, 2, 0);
    TEXTURES[SHRUB_4] = new Texture(webgl, SHRUB_4, "./images/Shrubs.png", 256, 32, 32, 32, 3, 0);
    TEXTURES[SHRUB_5] = new Texture(webgl, SHRUB_5, "./images/Shrubs.png", 256, 32, 32, 32, 4, 0);
    TEXTURES[SHRUB_6] = new Texture(webgl, SHRUB_6, "./images/Shrubs.png", 256, 32, 32, 32, 5, 0);
    TEXTURES[SHRUB_7] = new Texture(webgl, SHRUB_7, "./images/Shrubs.png", 256, 32, 32, 32, 6, 0);
    TEXTURES[SHRUB_8] = new Texture(webgl, SHRUB_8, "./images/Shrubs.png", 256, 32, 32, 32, 7, 0);
}
