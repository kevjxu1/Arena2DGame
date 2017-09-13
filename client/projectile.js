class Projectile {
    constructor(x, y, radius, speed, range, dir, playerId, color) {
        this.id = (new Date()).valueOf();  // unique(ish) id
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.range = range;
        this.dir = dir;  // in radians
        this.playerId = playerId;
        this.color = color;
    }
}

