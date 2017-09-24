var defaults = require('./defaults.js');

class Projectile {
    constructor(params) {
            //x, y, 
            //radius=defaults.DEFAULT_PROJECTILE_RADIUS, 
            //speed=defaults.DEFAULT_PROJECTILE_SPEED, 
            //range=DEFAULT_PROJECTILE_RANGE, 
            //dir, playerId, color) 
    //{

        // startX and startY are used to determine whether projectile has
        // reached the end of its max distance. 
        // This may change if we decide to have projectiles that do not move
        // in a constant direction
        this.startX = params.x || null;
        this.startY = params.y || null;

        this.x = params.x || null;
        this.y = params.y || null;
        this.radius = params.radius || defaults.DEFAULT_PROJECTILE_RADIUS;
        this.speed = params.speed || defaults.DEFAULT_PROJECTILE_SPEED;
        this.range = params.range || defaults.DEFAULT_PROJECTILE_RANGE;
        this.dir = params.dir || null;  // in radians

        // playerId is used to make sure a player's own projectile doesn't 
        // kill himself.
        this.playerId = params.playerId || null;

        this.color = params.color || null;
    }
}

module.exports = Projectile;
