// canvas
var canvas,
    canvasBack,
    canvasFront,
    context,
    contextBack,
    contextFront;

// to be received by server
var mapWidth,
    mapHeight;
// name constants for encoding of move directions
var dirs;

var SCREEN_WIDTH = window.innerWidth * 0.95;
var SCREEN_HEIGHT = window.innerHeight * 0.95;
//SCREEN_WIDTH= 1000,
//SCREEN_HEIGHT= 700,

// input key constants
const KEY_UNPRESSED = -1;
const KEY_ENTER = 13;
const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_SPACE = 32;
const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;
const KEY_SHIFT = 16;

// game objects visible to user
var visibleOthers = {};
var socketId;
var projectiles = {};
var mainPlayer;
var powerups;

var timeLastFired = 0;
var timeLastAnnounced = 0;
var playerDead = false;

// The maximum number of chat messages able to be displayed
const MAX_CHAT_COUNT = 15;
