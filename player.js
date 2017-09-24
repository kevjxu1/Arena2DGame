var dirs = require('./dirs.js');
var defaults = require('./defaults.js');

class Player {
    constructor(id, name='', color='red', radius=defaults.DEFAULT_PLAYER_RADIUS,
            speed=3, vision=1e10,
            x, y, angle=0, moveDir=dirs.DIR_NONE,
            reloadTime=750, hp=defaults.DEFAULT_PLAYER_HP)
    {
        this.id = id;  // same as socket.id
        this.name = name;
        this.radius = radius;
        this.speed = speed;

        // this is currently not used (defaulted at 1e100)
        // Will vision and Fog of War be a good feature? 
        // Blinding weapon powerup?
        this.vision = vision;

        this.x = x; this.y = y;

        // this is a player property because we may want drawPlayer to 
        // visualize an aimer
        this.angle = angle;

        this.moveDir = moveDir;

        // TODO: maybe we can move this a non-property to save memory
        this.reloadTime = reloadTime;

        this.hp = hp;
    }
}

module.exports = Player;
