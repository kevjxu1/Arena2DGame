var canvas,
    context;

var Globals = {
    // game parameters
	DEFAULT_PLAYER_RADIUS: 20, 
    DEFAULT_PLAYER_COLOR: 'red',
    DEFAULT_PLAYER_SPEED: 2,
    DEFAULT_PLAYER_VISION: 1e10,

    DEFAULT_MAP_WIDTH: 2000,
    DEFAULT_MAP_HEIGHT: 1000,

    //DEFAULT_BACKGROUND_COLOR: '#CCCFD3',  // light gray
    DEFAULT_BACKGROUND_COLOR: '#D3D3D3',  // light gray

    DEFAULT_PROJECTILE_SPEED: 5,
    DEFAULT_PROJECTILE_RADIUS: 5,
    DEFAULT_PROJECTILE_RANGE: 250,

    SCREEN_WIDTH: window.innerWidth * 0.9,
    SCREEN_HEIGHT: window.innerHeight * 0.9,

    // directions
    //UP: 1, LEFT: 2, RIGHT: 3, DOWN: 4,
    DIR_NONE: 0x0,
    DIR_UP: 0x1,  // 0x1
    DIR_LEFT: 0x2,  // 0x2
    DIR_RIGHT: 0x4,  // 0x4
    DIR_DOWN: 0x8,  // 0x8

    // input constants
    KEY_UNPRESSED: -1,
    KEY_ENTER: 13,
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40,
    KEY_SPACE: 32,
    KEY_W: 87,
    KEY_A: 65,
    KEY_S: 83,
    KEY_D: 68,
    KEY_SHIFT: 16
};
//module.exports = Globals;
