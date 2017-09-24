var defaults = require('./defaults.js');

class Projectile {
    constructor(x, y, 
            radius=defaults.DEFAULT_PROJECTILE_RADIUS, 
            speed=defaults.DEFAULT_PROJECTILE_SPEED, 
            range=DEFAULT_PROJECTILE_RANGE, 
            dir, playerId, color) {

        // TODO: idk why I didn't do SHA or something... two projectiles made
        // at the same time would be an issue
        this.id = (new Date()).valueOf();  // unique(ish) id

        // startX and startY are used to determine whether projectile has
        // reached the end of its max distance. 
        // This may change if we decide to have projectiles that do not move
        // in a constant direction
        this.startX = x;
        this.startY = y;

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.range = range;
        this.dir = dir;  // in radians

        // playerId is used to make sure a player's own projectile doesn't 
        // kill himself.
        this.playerId = playerId;

        this.color = color;
    }
}

module.exports = Projectile;
