// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.jpg";

// left-right side image
var sideReady = false;
var sideImage = new Image();
sideImage.onload = function () {
    sideReady = true;
};
sideImage.src = "images/side.jpg";

// Top-bottom side image
var topReady = false;
var topImage = new Image();
topImage.onload = function () {
    topReady = true;
};
topImage.src = "images/top.jpg";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/sprite-animation.png";

// balloon image
var balloonReady = false;
var balloonImage = new Image();
balloonImage.onload = function () {
    balloonReady = true;
};
balloonImage.src = "images/balloon.png";

//obstacle image

var bombReady = false;
var bombImage = new Image();
bombImage.onload = function () {
    bombReady = true;
};
bombImage.src = "images/bomb.png";

// Game objects

var hero = {
    speed: 256, // movement in pixels per second
    x: 0,  // where on the canvas are they?
    y: 0  // where on the canvas are they?
};

var balloon = {
    // for this version, the balloon does not move, so just and x and y
    x: 0,
    y: 0
};

var bomb1 = {
    // for this version, the bomb does not move, so just and x and y
    x: 100,
    y: 80
};

var bomb2 = {
    // for this version, the bomb does not move, so just and x and y
    x: 350,
    y: 120
};

var bomb3 = {
    // for this version, the bomb does not move, so just and x and y
    x: 200,
    y: 450
};


var bomb4 = {
    // for this version, the bomb does not move, so just and x and y
    x: 550,
    y: 250
};

var bomb5 = {
    // for this version, the bomb does not move, so just and x and y
    x: 400,
    y: 600
};

// lots of variables to keep track of sprite geometry
// we are having 4 rows and 3 cols in the current sprite sheet
var rows = 4;
var cols = 3;

//second row for the left movement (counting the index from 0)
var trackLeft = 1;
//third row for the right movement (counting the index from 0)
var trackRight = 2;
var trackUp = 3;
var trackDown = 0;

var spriteWidth = 192;//also spriteWidth/cols;
var spriteHeight = 256;//also spriteHeight/rows;
var width = spriteWidth / cols;
var height = spriteHeight / rows;

var curXFrame = 0;// start on left side
var frameCount = 3;// 3 frames per row
// x and y coordinates of the overall sprite image to get the single frame we want
var srcX = 0; // Our image has no borders or other stuff
var srcY = 0;

//assuming that at start the character will move right side
var left = false;
var right = true;
var up = false;
var down = false;

var counter = 0;



var balloonsCaught = 0;
var gameOver = false;

// Handle keyboard controls
var keysDown = {}; //object were we properties when keys go down
// and then delete them when the key goes up
// so the object tells us if any key is down when that keycode
// is down.  In our game loop, we will move the hero image if when
// we go thru render, a key is down

addEventListener("keydown", function (e) {
    //console.log(e.keyCode + " down")
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    //console.log(e.keyCode + " up")
    delete keysDown[e.keyCode];
}, false);

// Update game objects
var update = function (modifier) {
    ctx.clearRect(hero.x, hero.y, width, height);
    left = false; // for animation
    right = false; // for animation
    up = false;
    down = false;

    if (38 in keysDown && hero.y > 32 + 4) { //  holding up key
        up = true; // for animation
        down = false; // for animation
        left = false; // for animation
        right = false; // for animation
        hero.y -= hero.speed * modifier;
    }
    //if (40 in keysDown && hero.y < canvas.height - (64 + 6)) { //  holding down key
    if (40 in keysDown && hero.y < canvas.height - (96 + 2)) { //  holding down key
        up = false; // for animation
        down = true; // for animation
        left = false; // for animation
        right = false; // for animation
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown && hero.x > (32 + 4)) { // holding left key
        up = false; // for animation
        down = false; // for animation
        left = true; // for animation
        right = false; // for animation
        hero.x -= hero.speed * modifier;
    }

    //if (39 in keysDown && hero.x < canvas.width - (64 + 6)) { // holding right key
    if (39 in keysDown && hero.x < canvas.width - (96 + 2)) { // holding right key
        up = false; // for animation
        down = false; // for animation
        left = false; // for animation
        right = true; // for animation
        hero.x += hero.speed * modifier;
    }


    // Are they touching?
    if (
        hero.x <= (balloon.x + 64)
        && balloon.x <= (hero.x + 64)
        && hero.y <= (balloon.y + 64)
        && balloon.y <= (hero.y + 64)
    ) {
        ++balloonsCaught;       // keep track of our “score”
        if (balloonsCaught > 4) {
            alert("You won!")            
        };
        reset();       // start a new cycle
        
    }

    //curXFrame = ++curXFrame % frameCount; //updating the sprite frame index
    // it will count 0,1,2,0,1,2,etc

    if (counter == 5) {//adjust this to change "walking speed" of animation
        curXFrame = ++curXFrame % frameCount; //updating the sprite frame index
        // it will count 0,1,2,0,1,2,etc
        counter = 0;
    } else {
        counter++;
    }

    srcX = curXFrame * width; //calculating the x coordinate for spritesheet

    // if left is true, pick Y dim of the correct row
    if (left) {
        //calculate srcY
        srcY = trackLeft * height;
    }

    // if right is true, pick Y dim of the correct row
    if (right) {
        //calculate srcY
        srcY = trackRight * height;
    }

    // if up is true, pick Y dim of the correct row
    if (up) {
        //calculate srcY
        srcY = trackUp * height;
    }

    // if right is true, pick Y dim of the correct row
    if (down) {
        //calculate srcY
        srcY = trackDown * height;
    }


    if (left == false && right == false && up==false && down==false) {
        srcX = 1 * width;
        srcY = 0 * height;
    }

    // check if hero touches bomb
  
    if (touchingBomb(hero)) {
        alert("You have been shocked to death, game over!")
        gameOver = true;
    }

};


//============================================================


// Draw everything in the main render function
var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (!gameOver) {

        if (sideReady) {
            ctx.drawImage(sideImage, 0, 0);
            ctx.drawImage(sideImage, 800 - 32, 0);
        }

        if (topReady) {
            ctx.drawImage(topImage, 0, 0);
            ctx.drawImage(topImage, 0, 800 - 32);
        }

        if (heroReady) {
            //ctx.drawImage(heroImage, hero.x, hero.y);
            ctx.drawImage(heroImage, srcX,srcY,width,height,hero.x, hero.y,width,height);
        }

        if (balloonReady) {
            ctx.drawImage(balloonImage, balloon.x, balloon.y);
        }

        if (bombReady) {
            ctx.drawImage(bombImage, bomb1.x, bomb1.y);
            ctx.drawImage(bombImage, bomb2.x, bomb2.y);
            ctx.drawImage(bombImage, bomb3.x, bomb3.y);
            ctx.drawImage(bombImage, bomb4.x, bomb4.y);
            ctx.drawImage(bombImage, bomb5.x, bomb5.y);
        }
    }

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Balloons caught: " + balloonsCaught, 34, 34);

};

// Reset the game when the player catches a balloon
var reset = function () {
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

    //Place the balloon somewhere on the screen randomly
    // but not in the hedges, Article in wrong, the 64 needs to be 
    // hedge 32 + hedge 32 + char 32 + text height 28= 124
    balloon.x = 32 + (Math.random() * (canvas.width - 128));
    balloon.y = 60 + (Math.random() * (canvas.height - 156));

    let notGood = true;
    while (notGood) {
        //place the balloon somewhere on the screen randomly
        balloon.x = 32 + (Math.random() * (canvas.width - 128));
        balloon.y = 60 + (Math.random() * (canvas.height - 156));
        if (!touchingBomb(balloon)) {
            notGood = false;
        }
    }
};


// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000);
    render();
    then = now;
    //  Request to do this again ASAP
    requestAnimationFrame(main);
};


// Let's play this game!
var then = Date.now();
reset();
main();  // call the main game loop.

//=============================================================

function touchingBomb(who) {
    // check if player touches bomb
    if (
        (who.x <= (bomb1.x + 40) // 64 is length and width for the character, 50 is length and width for the obstacle 
            && bomb1.x <= (who.x + 50)
            && who.y <= (bomb1.y + 50)
            && bomb1.y <= (who.y + 64)) ||
        (who.x <= (bomb2.x + 40) 
            && bomb2.x <= (who.x + 50)
            && who.y <= (bomb2.y + 50)
            && bomb2.y <= (who.y + 64))||
        (who.x <= (bomb3.x + 40) 
            && bomb3.x <= (who.x + 50)
            && who.y <= (bomb3.y + 50)
            && bomb3.y <= (who.y + 64)) ||
        (who.x <= (bomb4.x + 40) 
            && bomb4.x <= (who.x + 50)
            && who.y <= (bomb4.y + 50)
            && bomb4.y <= (who.y + 64))||
        (who.x <= (bomb5.x + 40) 
            && bomb5.x <= (who.x + 50)
            && who.y <= (bomb5.y + 50)
            && bomb5.y <= (who.y + 64))
    )
        return true;        
}