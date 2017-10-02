var dirs = require('./dirs.js');
var defaults = require('./defaults.js');

class Player {
    // params is an object of optional parameters:
    // id, name, color, radius, speed, vision, x, y, angle, moveDir, shootRadius
    // reloadTime, hp
    constructor(params) {
    
    //id, name='', color='red', radius=defaults.DEFAULT_PLAYER_RADIUS,
    //        speed=3, vision=1e10,
    //        x, y, angle=0, moveDir=dirs.DIR_NONE,
    //        reloadTime=750, hp=defaults.DEFAULT_PLAYER_HP)
    //{

        this.id = params.id || null;  // same as socket.id
        this.name = params.name || '';
        this.color = params.color || null;
        this.radius = params.radius || defaults.DEFAULT_PLAYER_RADIUS;
        this.speed = params.speed || defaults.DEFAULT_PLAYER_SPEED;

        // this is currently not used (defaulted at 1e100)
        // Will vision and Fog of War be a good feature? 
        // Blinding weapon powerup?
        this.vision = params.vision || defaults.DEFAULT_PLAYER_VISION;

        this.x = params.x || null; this.y = params.y || null;

        // this is a player property because we may want drawPlayer to 
        // visualize an aimer
        this.angle = params.angle || 0;

        this.moveDir = params.moveDir || dirs.DIR_NONE;

        // TODO: maybe we can move this a non-property to save memory
        this.reloadTime = params.reloadTime || defaults.DEFAULT_PLAYER_RELOADTIME;

        this.hp = params.hp || defaults.DEFAULT_PLAYER_HP;
        this.shootRadius = params.shootRadius 
                || defaults.DEFAULT_PROJECTILE_RADIUS
    }
}

module.exports = Player;
