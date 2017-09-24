'use strict'; 

var announceMessage = '';
var chatClient = new ChatClient();
    
function getDistance(circle1, circle2) {
    let xdiff = circle2.x - circle1.x;
    let ydiff = circle2.y - circle1.y;
    let dist = Math.sqrt((xdiff * xdiff) + (ydiff * ydiff));
    return dist;
}

function checkCollisions(player, visibleOthers) {
    for (let i = 0; i < visibleOthers.length; i++) {
        let other = visibleOthers[i];
        let dist = getDistance(other, player);
        if (dist < player.radius + other.radius) {
            // collision detected
            return true;
        }
    }
    return false;
}

function atan2(x, y) {
    let rQuadVal = Math.atan(y / x);
    return (x < 0) ? 
        rQuadVal + Math.PI:
        rQuadVal + (2 * Math.PI);
}

function killPlayer() {
    playerDead = true;
    console.log('player died');
	IO.socket.off('updatePlayerPos');
	IO.socket.off('updatePlayerPowerup');
	IO.socket.off('updatePlayerHp');
    IO.socket.off('movePlayer');
	IO.socket.off('updateProjectiles');                                    
	Input.removeEventListeners();                                          
    
    let x = mainPlayer.x;
    let y = mainPlayer.y;
    mainPlayer = { x: x, y: y };
	//mainPlayer = null;                                                     
    IO.socket.emit('playerDied');
}

function sendGlobals() {
    IO.socket.emit('updateGlobals', { Globals: Globals });
}

function clearForm() {
    let form = document.getElementById('form');
    form.style.display = 'none';
}

// initialize socket.io socket
IO.init();
console.log('spawning chatClient with socket: ' + IO.socket);
chatClient.init(IO.socket, context);

// Front Page Form
$(document).ready(function() {
    console.log('document ready');

    // disable right-click context menu on canvas
    $('body').on('contextmenu', '#canvasDiv', function(e) { return false; });
    
    // process form input on submit
    $('#submit').on('click', function(e) {
        console.log('submit clicked');
        let nameInput = $('#nameInput').val();
        let colorInput = $('.colorInput:checked').val();

        // add new player on server
        IO.socket.emit('addPlayer', { name: nameInput, color: colorInput });
        $('#frontPage').hide();
    });
    console.log('submit binded');
});

////////////////////////////////////////////////////

function gameLoop(contextFront) {
    Canvas.clearScreen(contextFront);
    Canvas.drawGrid(contextFront, mainPlayer);
    Canvas.drawVisibleOthers(contextFront, visibleOthers, mainPlayer);
    Canvas.drawPowerups(contextFront, powerups);
    if (!playerDead) {
        Canvas.drawPlayer(contextFront, mainPlayer, 
                Globals.SCREEN_WIDTH / 2, Globals.SCREEN_HEIGHT / 2);
    }
    Canvas.drawProjectiles(contextFront, projectiles, mainPlayer);
    Canvas.drawMapBounds(contextFront, mapWidth, mapHeight, mainPlayer);
    if (!playerDead) {
        Canvas.drawHpText(contextFront, mainPlayer.hp, mainPlayer.color);
    }
    if (announceMessage != '') {
        if (new Date().getTime() - timeLastAnnounced < 3500) {
            Canvas.announce(contextFront, announceMessage);
        }
        else {
            announceMessage = '';
        }
    }

    if (!playerDead)
        requestAnimationFrame(function () {
            gameLoop(contextFront);
        });
};

function runApp() {
    console.log('running app');
    Canvas.drawBackground(contextBack);
    gameLoop(contextFront);
}

////////////////////////////////////////////////////


