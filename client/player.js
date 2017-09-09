var Player = {
    player: {
        id: null,
        name: '',
        color: Globals.DEFAULT_PLAYER_COLOR,
        radius: Globals.DEFAULT_PLAYER_RADIUS,
        speed: Globals.DEFAULT_PLAYER_SPEED,
        vision: Globals.DEFAULT_PLAYER_VISION,
        x: Globals.SCREEN_WIDTH / 2,  
        y: Globals.SCREEN_HEIGHT / 2,
        angle: 0,
        moveDir: Globals.DIR_NONE,
        reloadTime: Globals.DEFAULT_PLAYER_RELOADTIME,  // in ms
        hp: Globals.DEFAULT_PLAYER_HP
    }
};

