
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
let blockSize = Math.round(((innerWidth + innerHeight) / 2) / 20);

let key = {
    left: false,
    right: false,
    up: false,
    down: false,
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
}

let camera = {
    x: 0,
    y: 0
}

let blocks = [];
let exits = [];
let lava = [];
let anchors = [];

let currentLevel = 1;
let levelWidth = 0;
let levelHeight = 0;
let levels = {
    0: {
        anchorWidths: [],
        sceneChanges: [[1, 3, 1, 0, 16, "right"]],
        map: [
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb                             |",
            "bb                              ",
            "bb                              ",
            "bb                          bbbb",
            "bb                         bbbbb",
            "bb                        bbbbbb",
            "bb                       bbbbbbb",
            "bb                      bbbbbbbb",
            "bb                     bbbbbbbbb",
            "bb                    bbbbbbbbbb",
            "bb                   bbbbbbbbbbb",
            "bb                  bbbbbbbbbbbb",
            "bb                 bbbbbbbbbbbbb",
            "bb                bbbbbbbbbbbbbb",
            "bb               bbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        ]
    },
    1: {
        anchorWidths: [],
        sceneChanges: [[1, 3, 0, 31, 16, "left"], [1, 4, 2, 0, 14, "right"],[6, 1, 5, 7.5, -1, "down"]],
        map: [
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "|                             bb",
            "                              bb",
            "                              bb",
            "bbbbb                         bb",
            "bb        bbb                 bb",
            "bb                            bb",
            "bb                            bb",
            "bb   bbb                      bb",
            "bb                             |",
            "bb                              ",
            "bb                              ",
            "bbb    bbb                      ",
            "bb   bbb bbb                 bbb",
            "bb         bbb              bbbb",
            "bb                         bbbbb",
            "bbbbbbbbbbbbbbbbb      bbbbbbbbb",
            "bbbbbbbbbbbbbbbbb|     bbbbbbbbb",
        ]
    },
    2: {
        sceneChanges: [[1, 3, 1, 31, 25, "left"]],
        anchorWidths: [3, 3],
        map: [
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb         _       _          bb",
            "bb         bbb     bbb        bb",
            "bb        bb         bb       bb",
            "|        bbblllllllllbbb      bb",
            "        bbbblllllllllbbbb     bb",
            "       bbbbblllllllllbbbbb    bb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
        ]
    },
    5: {
        sceneChanges: [[6, 1, 1, 20, 32, "up", 19]],
        anchorWidths: [],
        map: [
            "bbbbb|     bbbbbbbbbbbbbbbbbbbbb",
            "bbbbb      bbbbbbbbbbbbbbbbbbbbb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb   bbbbbb                   bb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb           bbbb             bb",
            "bb                            bb",
            "bb                            bb",
            "bb                  bbbb      bb",
            "bb                            bb",
            "bb                            bb",
            "bb             bbbb           bb",
            "bb                            bb",
            "bb                            bb",
            "bb        b                   bb",
            "bb       bbb                  bb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
        ]
    }
};


class Player {
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height; 

        this.lives = 5;
        this.maxLives = 5;

        this.inAir = 99;
        this.jumpBuffer = 0;
        this.jumping = 100;

        this.gravity = 90;
        this.acceleration = blockSize / 90;
        this.maxSpeed = blockSize / 8;
        this.friction = 0.8;
        this.airResistance = 0.98;
        this.maxGravity = blockSize / 3;
        this.maxJumpDuration = 15;

        this.velocity = {
            x: 0,
            y: 0
        }

        this.immobilityFrames = 0;
        this.freezeFrames = 0;
        this.dir = "right";

        this.canChangeScene = true;

        this.sceneReenter = {
            x: 0,
            y: 0
        }
        this.sceneChangeAnimationFrame = 10000000000000000;
        this.sceneChangeDir = "left";
        this.activeExit = null;
    } 
    draw(){
        ctx.fillStyle = "red";
        ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
    }
    update(){
        this.immobilityFrames--;
        this.freezeFrames--;
        this.sceneChangeAnimationFrame++;
        if(key.a && this.immobilityFrames < 1){
            this.velocity.x -= this.acceleration;
            if(this.velocity.x < -this.maxSpeed){
                this.velocity.x = -this.maxSpeed;
            }
            this.dir = "left";
        }
        if(key.d && this.immobilityFrames < 1){
            this.velocity.x += this.acceleration;
            if(this.velocity.x > this.maxSpeed){
                this.velocity.x = this.maxSpeed;
            }
            this.dir = "right";
        }
        
        if(this.immobilityFrames > 1 || ((!(key.a || key.d)) || (key.a && key.d))){
            if(this.inAir === 0){
                this.velocity.x *= this.friction;
            } else {
                this.velocity.x *= this.airResistance;
            }
        }

        this.inAir++;
        this.jumping++;
        if(this.freezeFrames <= 0){
            this.velocity.y += blockSize / this.gravity;
            if(this.velocity.y > this.maxGravity){
                this.velocity.y = this.maxGravity;
            }
        }

        if((key.space && this.inAir <= 5 && this.jumpBuffer > 0 && this.immobilityFrames < 1) || (key.space && this.jumping < this.maxJumpDuration && this.immobilityFrames < 1)){
            this.velocity.y = -blockSize / 5;
            if(this.jumping > this.maxJumpDuration){
                this.jumping = 0;
            }
        }

        if(key.space){
            this.jumpBuffer--;
        } else{
            if(this.jumping < this.maxJumpDuration){
                if(this.jumping > 8){
                    this.velocity.y *= 0.5;
                }
                this.jumping = 1000000;
                this.gravity = 75;
            }
            this.jumpBuffer = 4;
        }
        if(this.freezeFrames < 0){
            this.x += this.velocity.x;
            this.x = Math.round(this.x);
            if(checkBlockCollisions(this)){
                if(this.velocity.x > 0){
                    while(checkBlockCollisions(this)){
                        this.x--;
                    }
                } else {
                    while(checkBlockCollisions(this)){
                        this.x++;
                    }
                }
                this.velocity.x = 0;
            }
            this.y += this.velocity.y;
            this.y = Math.round(this.y);
            if(checkBlockCollisions(this)){
                if(this.velocity.y > 0){
                    while(checkBlockCollisions(this)){
                        this.y--;
                    }
                    this.inAir = 0;
                    this.gravity = 90;
                } else {
                    while(checkBlockCollisions(this)){
                        this.y++;
                    }
                    this.jumping = 100;
                }
                this.velocity.y = 0;
            }
        } else{
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.inAir = Infinity;
            this.jumping = Infinity;
        }

        let exitID = checkExitCollisions(this);
        if(exitID !== null && this.canChangeScene){
            this.activeExit = exitID;
            this.immobilityFrames = Infinity;
            this.sceneChangeAnimationFrame = 0;
            if(levels[currentLevel].sceneChanges[this.activeExit][5] === "left" || levels[currentLevel].sceneChanges[this.activeExit][5] === "right"){
                this.velocity.x = 0;
            }
            this.canChangeScene = false;
        }
        if(checkExitCollisions(this) === null && this.sceneChangeAnimationFrame > 75){
            this.canChangeScene = true;
        }
        if(this.sceneChangeAnimationFrame > 0 && this.sceneChangeAnimationFrame < 15){
            if(levels[currentLevel].sceneChanges[this.activeExit][5] === "left"){
                this.x -= blockSize / 10;
                this.sceneChangeDir = "left";
            }
            if(levels[currentLevel].sceneChanges[this.activeExit][5] === "right"){
                this.x += blockSize / 10;
                this.sceneChangeDir = "right";
            }
            if(levels[currentLevel].sceneChanges[this.activeExit][5] === "up"){
                this.velocity.y = 0;
                this.y -= blockSize / 4;
                this.sceneChangeDir = "up";
            }
            if(levels[currentLevel].sceneChanges[this.activeExit][5] === "down"){
                this.sceneChangeDir = "down";
            }
        }
        if(this.sceneChangeAnimationFrame === 20){
            this.sceneReenter.x = blockSize * levels[currentLevel].sceneChanges[this.activeExit][3];
            this.sceneReenter.y = blockSize * levels[currentLevel].sceneChanges[this.activeExit][4];
            if(this.sceneChangeDir === "up" && player.dir === "left"){
                this.sceneReenter.x = blockSize * levels[currentLevel].sceneChanges[this.activeExit][6];
            }
            this.x = this.sceneReenter.x;
            this.y = this.sceneReenter.y;
            this.velocity.x = 0; 
            this.velocity.y = 0;
            currentLevel = levels[currentLevel].sceneChanges[this.activeExit][2];
            camera.x += player.x - (canvas.width / 2) + (player.width / 2) - camera.x;
            camera.y += player.y - (canvas.height / 2) + (player.height / 2) - camera.y;
            moveCamera();
            resetLevel();
            if(this.sceneChangeDir === "down" || this.sceneChangeDir === "up"){
                this.freezeFrames = 30;
            }
            if(this.sceneChangeDir === "down" || this.sceneChangeDir === "up"){
                this.velocity.x = 0;
            }
        }
        if(this.sceneChangeAnimationFrame > 40 && this.sceneChangeAnimationFrame < 70){
            if(this.sceneChangeDir === "left"){
                this.x -= blockSize / 15;
            }
            if(this.sceneChangeDir === "right"){
                this.x += blockSize / 15;
            }
        }
        if(this.sceneChangeAnimationFrame === 50 && this.sceneChangeDir === "down"){
            this.velocity.y = 0;
        }
        if(this.sceneChangeAnimationFrame === 50 && this.sceneChangeDir === "up"){
            this.x = this.sceneReenter.x;
            this.y = this.sceneReenter.y;
            this.velocity.y = -blockSize / 2.85;
            this.immobilityFrames = 60;
            this.inAir = 1;
            this.jumping = 0;
        }
        if(this.sceneChangeAnimationFrame >= 50 && this.sceneChangeAnimationFrame <= 68 && this.sceneChangeDir === "up"){
            if(player.dir === "right"){
                this.velocity.x = blockSize / 9;
            } else if(player.dir === "left"){
                this.velocity.x = -blockSize / 9;
            }
        }
        if(this.sceneChangeAnimationFrame === 75 && this.sceneChangeDir !== "up"){
            this.immobilityFrames = 0;
        }
    }
    resetPhysics(){
        this.gravity = 90;
        this.acceleration = blockSize / 90;
        this.maxSpeed = blockSize / 8;
        this.friction = 0.8;
        this.airResistance = 0.98;
        this.maxGravity = blockSize / 3;
        this.maxJumpDuration = 15;
    };
}
const player = new Player(blockSize * 3, blockSize * 3, blockSize, blockSize*2)

class Block {
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height; 
    } 
    draw(){
        ctx.fillStyle = "black";
        ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
    }
}

class Lava {
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height; 
    } 
    draw(){
        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
    }
}

class Anchor {
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height; 
    } 
    draw(){
        ctx.fillStyle = "rgb(200, 200, 200)";
        ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
    }
}

class Exit {
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height; 
    } 
}
let curtainAlpha = 0;
function handleCurtains(){
    let curtain = false;
    ctx.fillStyle = "black";
    if(player.sceneChangeAnimationFrame >= 0 && player.sceneChangeAnimationFrame <= 20){
        curtainAlpha+=0.05;
        curtain = true;
    }
    if(player.sceneChangeAnimationFrame > 20 && player.sceneChangeAnimationFrame < 50){
        curtain = true;
    }
    if(player.sceneChangeAnimationFrame >= 50 && player.sceneChangeAnimationFrame <= 70){
        ctx.fillStyle = "black";
        curtainAlpha-=0.05;
        curtain = true;
    }
    if(curtainAlpha < 0){
        curtainAlpha = 0;
    }
    if(curtainAlpha > 1){
        curtainAlpha = 1;
    }
    ctx.globalAlpha = curtainAlpha;
    if(curtain){
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.globalAlpha = 1; 
}

function drawHPReporter () {
    for(let i = 0; i < player.maxLives; i++){
        ctx.fillStyle = "rgb(68, 68, 68)";
        ctx.fillRect(blockSize * 0.75 + i * blockSize, blockSize * 0.75, blockSize * 0.75, blockSize * 0.75)
    }
    for(let i = 0; i < player.lives; i++){
        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.fillRect(blockSize * 0.75 + i * blockSize, blockSize * 0.75, blockSize * 0.75, blockSize * 0.75)
    }
}

function drawBlocks(){
    for(let i = 0; i < blocks.length; i++){
        blocks[i].draw();
    }
    for(let i = 0; i < lava.length; i++){
        lava[i].draw();
    }
    for(let i = 0; i < anchors.length; i++){
        anchors[i].draw();
    }
    player.draw();
}
function updateBlocks(){
    player.update();
}

function createBlocks(){
    let exitIndex = 0;
    let anchorIndex = 0;
    for(let i = 0; i < levels[currentLevel].map.length; i++){
        for(let j = 0; j < levels[currentLevel].map[i].length; j++){
            if(levels[currentLevel].map[i][j] === "b"){
                blocks.push(new Block(j * blockSize, i * blockSize, blockSize, blockSize));
            }
            if(levels[currentLevel].map[i][j] === "l"){
                lava.push(new Lava(j * blockSize, i * blockSize, blockSize, blockSize));
            }
            if(levels[currentLevel].map[i][j] === "_"){
                anchors.push(new Anchor(j * blockSize, i * blockSize, blockSize * levels[currentLevel].anchorWidths[anchorIndex], blockSize));
                anchorIndex++;
            }
            if(levels[currentLevel].map[i][j] === "|"){
                exits.push(new Exit(j * blockSize, i * blockSize, blockSize * levels[currentLevel].sceneChanges[exitIndex][0], blockSize * levels[currentLevel].sceneChanges[exitIndex][1]));
                exitIndex++;
            }
        }
    }
}

function clearBlocks(){
    exits = [];
    blocks = [];
    lava = [];
    anchors = [];
}

function moveCamera(){
    camera.x += (player.x - (canvas.width / 2) + (player.width / 2) - camera.x) / 10;
    camera.y += (player.y - (canvas.height / 2) + (player.height / 2) - camera.y) / 10;
    if(camera.x < blockSize){
        camera.x = blockSize;
    }
    if(camera.y < blockSize){
        camera.y = blockSize;
    }
    if(camera.x > levelWidth - canvas.width - blockSize){
        camera.x = levelWidth - canvas.width - blockSize;
    }
    if(camera.y > levelHeight - canvas.height - blockSize){
        camera.y = levelHeight - canvas.height - blockSize;
    }
    camera.x = Math.round(camera.x);
    camera.y = Math.round(camera.y);
}

function resizeCanvas(){
    let x = player.x / blockSize;
    let y = player.y / blockSize;
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    blockSize = Math.round(((innerWidth + innerHeight) / 2) / 20);
    rebuildLevel();
    player.width = blockSize;
    player.height = blockSize * 2;
    player.x = x * blockSize;
    player.y = y * blockSize;
    player.resetPhysics();
    moveCamera();
}

function rebuildLevel(){
    clearBlocks();
    createBlocks();
    levelWidth = levels[currentLevel].map[0].length * blockSize;
    levelHeight = levels[currentLevel].map.length * blockSize;
}

function resetLevel(){
    rebuildLevel();
    camera.x += player.x - (canvas.width / 2) + (player.width / 2) - camera.x;
    camera.y += player.y - (canvas.height / 2) + (player.height / 2) - camera.y;
    moveCamera();
}

function gameLoop(){
    requestAnimationFrame(gameLoop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveCamera();
    updateBlocks();
    drawBlocks();
    drawHPReporter();
    handleCurtains();
}
resetLevel();
gameLoop();

function isColliding(first, second){
    return first.x < second.x + second.width &&
           first.x + first.width > second.x &&
           first.y < second.y + second.height &&
           first.y + first.height > second.y;

}

function checkBlockCollisions(object){
    for(let i = 0; i < blocks.length; i++){
        if(isColliding(object, blocks[i])){
            return true;
        }
    }
    return false;
}

function checkLavaCollisions(object){
    for(let i = 0; i < lava.length; i++){
        if(isColliding(object, lava[i])){
            return true;
        }
    }
    return false;
}

function checkExitCollisions(object){
    for(let i = 0; i < exits.length; i++){
        if(isColliding(object, exits[i])){
            return i;
        }
    }
    return null;
}

window.addEventListener("keydown", (e) => {
    if(e.keyCode === 37){
        key.left = true;
    }
    if(e.keyCode === 39){
        key.right = true;
    }
    if(e.keyCode === 38){
        key.up = true;
    }
    if(e.keyCode === 40){
        key.down = true;
    }
    if(e.keyCode === 87){
        key.w = true;
    }
    if(e.keyCode === 65){
        key.a = true;
    }
    if(e.keyCode === 83){
        key.s = true;
    }
    if(e.keyCode === 68){
        key.d = true;
    }
    if(e.keyCode === 32){
        key.space = true;
    }
});

window.addEventListener("keyup", (e) => {
    if(e.keyCode === 37){
        key.left = false;
    }
    if(e.keyCode === 39){
        key.right = false;
    }
    if(e.keyCode === 38){
        key.up = false;
    }
    if(e.keyCode === 40){
        key.down = false;
    }
    if(e.keyCode === 87){
        key.w = false;
    }
    if(e.keyCode === 65){
        key.a = false;
    }
    if(e.keyCode === 83){
        key.s = false;
    }
    if(e.keyCode === 68){
        key.d = false;
    }
    if(e.keyCode === 32){
        key.space = false;
    }
});

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
})
window.addEventListener('resize', () => {
    resizeCanvas();
})