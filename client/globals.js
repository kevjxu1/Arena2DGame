var canvas,
    context;

var Globals = {
    // game parameters
	DEFAULT_PLAYER_RADIUS: 14, 
    DEFAULT_PLAYER_COLOR: 'red',
    DEFAULT_PLAYER_SPEED: 8,
    DEFAULT_PLAYER_VISION: 1e10,

    //DEFAULT_BACKGROUND_COLOR: '#CCCFD3',  // light gray
    DEFAULT_BACKGROUND_COLOR: '#D3D3D3',  // light gray

    DEFAULT_PROJECTILE_SPEED: 5,
    DEFAULT_PROJECTILE_THICKNESS: 5,
    DEFAULT_PROJECTILE_RANGE: 200,

    SCREEN_WIDTH: window.innerWidth * 0.7,
    SCREEN_HEIGHT: window.innerHeight * 0.7,

    // directions
    LEFT: 0, UP: 1, RIGHT: 2, DOWN: 3,

    // input constants
    KEY_UNPRESSED: -1,
    KEY_ENTER: 13,
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40,
    KEY_SPACE: 32
};
//module.exports = Globals;
