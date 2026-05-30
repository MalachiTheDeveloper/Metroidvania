const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
let blockSize = Math.round(((innerWidth + innerHeight) / 2) / 20);

let debugText = "";

let controls = {
    click: false,
    rightClick: false,
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
let particles = [];

let currentLevel = 0;
let levelWidth = 0;
let levelHeight = 0;
let levels = {
    0: {
        anchorWidths: [4,4,2,3,3],
        sceneChanges: [{width: 1, height: 3, level: 1, x: 0, y: 16, dir: "right", altX: "none"}],
        map: [
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bb                            bbb",
            "bb                            bbb",
            "bb                            bbb",
            "bb                            bbb",
            "bb                            bbb",
            "bb                            bbb",
            "bb                            bbb",
            "bb                            bbb",
            "bb                            bbb",
            "bb                            bbb",
            "bb                            bbb",
            "bb                            bbb",
            "bb                            bbb",
            "bb                              |",
            "bb                               ",
            "bb                          _    ",
            "bb                          bbbbb",
            "bb                         bbbbbb",
            "bb                        bbbbbbb",
            "bb                       bbbbbbbb",
            "bb                      bbbbbbbbb",
            "bb                     bbbbbbbbbb",
            "bb                    bbbbbbbbbbb",
            "bb                   bbbbbbbbbbbb",
            "bb                  bbbbbbbbbbbbb",
            "bb                 bbbbbbbbbbbbbb",
            "bb                bbbbbbbbbbbbbbb",
            "bb_    _  _   _  bbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        ]
    },
    1: {
        anchorWidths: [3, 2, 5, 4, 3, 3, 1, 3, 2, 2, 4, 2, 3, 3, 3, 3, 4],
        sceneChanges: [{width: 4, height: 1, level: 6, x: "none", y: 37, dir: "up", altX: 30}, {width: 1, height: 3, level: 0, x: 32, y: 16, dir: "left", altX: "none"}, {width: 1, height: 4, level: 2, x: 0, y: 15, dir: "right", altX: "none"},{width: 6, height: 1, level: 5, x: 7.5, y: -1, dir: "down", altX: "none"}],
        map: [
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbb|   bb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbb    bb",
            "bb                         b    bb",
            "bb                         b    bb",
            "bb                         b    bb",
            "bb                         b    bb",
            "bb                         b    bb",
            "bb                         b    bb",
            "bb                         b    bb",
            "bb                         b    bb",
            "bb                         b    bb",
            "bb                         b    bb",
            "bb                         b    bb",
            "bb                              bb",
            "bb                              bb",
            "|               _     _    _    bb",
            "                bbb   bb   bbbbbbb",
            " _                              bb",
            "bbbbb     _                     bb",
            "bb        bbb                   bb",
            "bb                              bb",
            "bb   _                          bb",
            "bb   bbb                        bb",
            "bb                               |",
            "bb                                ",
            "bb_    _                          ",
            "bbb  _ bbb_                  _    ",
            "bb   bbb bbb_                bbbbb",
            "bb         bbb              bbbbbb",
            "bb_   _   _   _        _   bbbbbbb",
            "bbbbbbbbbbbbbbbbb      bbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbb|     bbbbbbbbbbb",
        ]
    },
    6: {
        anchorWidths: [5, 3],
        sceneChanges: [{width: 4, height: 1, level: 1, x: 29.5, y: -1, dir: "down", altX: "none"}],
        map: [
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbl         bbll                bb",
            "bbl         bbll                bb",
            "bbl         bbll                bb",
            "bbl         bbll                bb",
            "bbl   l     bbll        l       bb",
            "bbb   l     bbll        b      lbb",
            "bbb   l                 b      lbb",
            "bbb   l                 b      lbb",
            "bbb   l                 b       bb",
            "bbb   l                 b       bb",
            "bbb   llllllllllllllllllb       bb",
            "bbb         bb          bl      bb",
            "bbl         bb          bl      bb",
            "bbl         bb          bl      bb",
            "bbl                     bl      bb",
            "bbl                     bl      bb",
            "bbl                     bl      bb",
            "bbl                     b       bb",
            "bblllllllllllllllllll   b      lbb",
            "bbl          bb         b      lbb",
            "bbl          bb         b      lbb",
            "bbl          bb         b       bb",
            "bbl          bb     llllb       bb",
            "bbl          bb         bl      bb",
            "bbl          bb         bl      bb",
            "bbl          bb         bl      bb",
            "bbl         llll        bl      bb",
            "bbl                     b       bb",
            "bbl                     b      lbb",
            "bbl _                   b      lbb",
            "bbl bbbbb   llll        b      lbb",
            "bbl  bbb     bb         b       bb",
            "bblllbbblllllbblllllllllb_      bb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbb    bb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbb|   bb",
        ]
    },
    2: {
        sceneChanges: [{width: 1, height: 3, level: 1, x: 33, y: 25, dir: "left", altX: "none"}],
        anchorWidths: [3, 3, 6, 4],
        map: [
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bb                             bbbbbbb",
            "bb                             bbbbbbb",
            "bb                             bbbbbbb",
            "bb         _        _          bbbbbbb",
            "bb         bbb      bbb        bbbbbbb",
            "bb        bb          bb       bbbbbbb",
            "|        bbbllllllllllbbb      bbbbbbb",
            "        bbbbllllllllllbbbb     bbbbbbb",
            " _     bbbbbllllllllllbbbbb_   bbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        ]
    },
    5: {
        sceneChanges: [{width: 6, height: 1, level: 1, x: 20, y: 32, dir: "up", altX: 19}],
        anchorWidths: [5, 4, 4, 4, 3, 3, 4, 4, 4, 1],
        map: [
            "bbbbb|     bbbbbbbbbbbbbbbbbbbbb",
            "bbbbb      bbbbbbbbbbbbbbbbbbbbb",
            "bb                            bb",
            "bb                            bb",
            "bb   _                        bb",
            "bb   bbbbbb                   bb",
            "bb                            bb",
            "bb                            bb",
            "bb           _                bb",
            "bb           bbbb             bb",
            "bb                            bb",
            "bb                  _         bb",
            "bb                  bbbb      bb",
            "bb                            bb",
            "bb             _              bb",
            "bb             bbbb           bb",
            "bb                            bb",
            "bb                            bb",
            "bb                            bb",
            "bb         b                  bb",
            "bb        bbb                 bb",
            "bb_   _  bbbbb_    _    _    _bb",
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
        this.dashDir = this.dir;
        this.touchingGround = false;

        this.canChangeScene = true;

        this.sceneReenter = {
            x: 0,
            y: 0
        }
        this.sceneChangeAnimationFrame = 10000000000000000;
        this.sceneChangeDir = "left";
        this.activeExit = null;

        this.abilities = ["dash", "wall jump", "double jump"];
        this.canUseDashKey = true;
        this.canDash = true;
        this.dashFrames = 0;
        this.dashCooldown = 0;
        this.wallSlideActivated = false;
        this.canDoubleJump = true;


        this.anchor = {
            x: this.x,
            y: this.y
        }
        this.spawnPoint = {
            x: this.x,
            y: this.y,
            level: currentLevel
        }
    } 
    draw(){
        ctx.fillStyle = "red";
        ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
        ctx.fillStyle = "rgb(255,255,255)";
        if(this.dir === "left"){
            ctx.fillRect(this.x - camera.x + this.width / 10, this.y - camera.y + this.height / 6, this.width / 3, this.width / 3);
            ctx.fillStyle = "black";
            ctx.fillRect(this.x - camera.x + this.width / 10 + this.width / 60, this.y - camera.y + this.height / 6 + this.width / 60, this.width / 5, this.width / 5);
        } else{
            ctx.fillRect(this.x - camera.x + this.width / 10*6, this.y - camera.y + this.height / 6, this.width / 3, this.width / 3);
            ctx.fillStyle = "black";
            ctx.fillRect(this.x - camera.x + this.width / 10*6 + (this.width / 3 - this.width / 5 - this.width / 60), this.y - camera.y + this.height / 6 + this.width / 60, this.width / 5, this.width / 5);
        }
    }
    update(){
        this.immobilityFrames--;
        this.freezeFrames--;
        this.dashFrames--;
        this.dashCooldown--;
        this.sceneChangeAnimationFrame++;
        if(this.abilities.includes('dash') && this.dashCooldown < 0 && controls.rightClick && this.canDash && this.canUseDashKey && this.immobilityFrames <= 0){
            this.dir = this.dashDir;
            this.dashFrames = 17;
            this.dashCooldown = 25;
            this.velocity.y = 0;
            this.canDash = false;
        }
        if(controls.rightClick){
            this.canUseDashKey = false;
        } else{
            this.canUseDashKey = true;
        }
        if(this.dashFrames === 0){
            if(this.velocity.x !== 0){
                this.velocity.x = this.velocity.x / Math.abs(this.velocity.x) * this.maxSpeed;
            }
            this.inAir = Infinity;
            this.jumping = Infinity;
            this.velocity.y = 0;
        }
        if(this.dashFrames <= 0){
            if(controls.a && this.immobilityFrames <= 0){
                this.velocity.x -= this.acceleration;
                if(this.velocity.x < -this.maxSpeed){
                    this.velocity.x = -this.maxSpeed;
                }
                this.dir = "left";
                this.dashDir = "left";
            }
            if(controls.d && this.immobilityFrames <= 0){
                this.velocity.x += this.acceleration;
                if(this.velocity.x > this.maxSpeed){
                    this.velocity.x = this.maxSpeed;
                }
                this.dir = "right";
                this.dashDir = "right";
            }
            
            if(this.immobilityFrames > 1 || ((!(controls.a || controls.d)) || (controls.a && controls.d))){
                if(this.inAir === 0){
                    this.velocity.x *= this.friction;
                } else {
                    this.velocity.x *= this.airResistance;
                }
            }

            this.inAir++;
            this.jumping++;
            this.handleWallJump();
            if(this.freezeFrames <= 0 && !((this.sceneChangeAnimationFrame < 70) && (this.sceneChangeDir === "left" || this.sceneChangeDir === "right"))){
                this.velocity.y += blockSize / this.gravity;
                if(this.velocity.y > this.maxGravity){
                    this.velocity.y = this.maxGravity;
                }
            }

            if((controls.space && this.inAir <= 5 && this.jumpBuffer > 0 && this.immobilityFrames <= 0) || (controls.space && this.jumping < this.maxJumpDuration && this.immobilityFrames <= 0)){
                this.velocity.y = -blockSize / 5;
                if(this.jumping > this.maxJumpDuration){
                    this.jumpBuffer = 0;
                    this.jumping = 0;
                }
            } else if(this.canDoubleJump && this.abilities.includes('double jump') && controls.space && this.jumpBuffer > 0 && this.immobilityFrames <= 0){
                this.velocity.y = -blockSize / 5;
                this.jumping = this.maxJumpDuration / 3;
                this.canDoubleJump = false;
            }

            if(controls.space){
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
        } else{
            if(this.dashDir === "left"){
                for(let i = 0; i < 5; i++){
                    particles.push(new Particle(player.x + player.width - blockSize / 3, player.y + (Math.random()) * player.height, blockSize / 6, "red", 1, "dash particle", blockSize / ((Math.random() * 5) + 10), blockSize * ((Math.random() * 0.1) - 0.05), 1, 1, Infinity, 0, 0, 0, 0.9, -0.05));
                }
                this.velocity.x = -blockSize / 3;
            }
            if(this.dashDir === "right"){
                for(let i = 0; i < 5; i++){
                    particles.push(new Particle(player.x, player.y + (Math.random()) * player.height, blockSize / 6, "red", 1, "dash particle", -blockSize / ((Math.random() * 5) + 10), blockSize * ((Math.random() * 0.1) - 0.05), 1, 1, Infinity, 0, 0, 0, 0.9, -0.05));
                }
                this.velocity.x = blockSize / 3;
            }
        }
        this.touchingGround = false;
        this.y++;
        if(checkBlockCollisions(this)){
            this.touchingGround = true;
        }
        this.y--;
        
        if(this.freezeFrames < 0){
            this.x += this.velocity.x;
            this.x = Math.round(this.x);
            if(checkBlockCollisions(this)){
                if(!this.touchingGround){
                    this.wallSlideActivated = true;
                }
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
                if(this.dashFrames > 5){
                    this.dashFrames = 5;
                }
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
                    this.canDoubleJump = true;
                    this.canDash = true;
                } else {
                    while(checkBlockCollisions(this)){
                        this.y++;
                    }
                    this.jumping = Infinity;
                }
                this.velocity.y = 0;
            }
        } else{
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.inAir = Infinity;
            this.jumping = Infinity;
        }
        this.handleHazardCollisions();
        this.handleSceneChanges();
    }
    handleWallSlideActivatedVariable(){
        if(this.touchingGround){
            this.wallSlideActivated = false;
            return;
        } 
        this.x++;
        if(checkBlockCollisions(this)){
            this.x--;
            if(this.velocity.y > 0 && this.wallSlideActivated === true){
                this.dir = "left";
            } 
            this.dashDir = "left";
            return;
        }
        this.x-=2;
        if(checkBlockCollisions(this)){
            this.x++;
            if(this.velocity.y > 0 && this.wallSlideActivated === true){
                this.dir = "right";
            } 
            this.dashDir = "right";
            return;
        }
        this.dashDir = this.dir;
        this.x++;
        this.wallSlideActivated = false;
    }
    handleWallJump(){
        this.handleWallSlideActivatedVariable();
        if(this.abilities.includes("wall jump") && !this.touchingGround && this.velocity.y >= 0){
            this.x++;
            if(checkBlockCollisions(this) && this.wallSlideActivated){
                    if(this.velocity.y > blockSize / 10){
                        this.velocity.y = blockSize / 10;
                    }
                    this.gravity = 90;
                    this.canDash = true;
                    this.canDoubleJump = true;
                    if(controls.space && this.jumpBuffer > 0 && this.immobilityFrames <= 0){
                        this.jumping = 0;
                        this.velocity.x = -this.maxSpeed * 1.2;
                    }
                    this.dir = "left";
                    this.dashDir = "left"
            }
            this.x-=2;
            if(checkBlockCollisions(this) && this.wallSlideActivated && this.immobilityFrames <= 0){
                if(this.velocity.y > blockSize / 10){
                    this.velocity.y = blockSize / 10;
                }
                this.gravity = 90;
                this.canDoubleJump = true;
                this.canDash = true;
                if(controls.space && this.jumpBuffer > 0){
                    this.jumping = 0;
                    this.velocity.x = this.maxSpeed * 1.2;
                }
                this.dir = "right";
                this.dashDir = "right";
            }
            this.x++;
        }    
    }
    handleHazardCollisions(){
        let anchorCollision = checkAnchorCollisions(this);
        if(anchorCollision !== null){
            this.anchor.x = anchors[anchorCollision].x + anchors[anchorCollision].width / 2 - (player.width / 2);
            this.anchor.y = anchors[anchorCollision].y + blockSize;
        }
        if(checkLavaCollisions(this)){
            this.lives--;
            this.dashFrames = -1;
            this.x = this.anchor.x;
            this.y = this.anchor.y;
            this.immobilityFrames = 30;
            this.velocity.x = 0;
            this.velocity.y = 0;
        }
        if(this.lives <= 0){
            this.immobilityFrames = 80;
            this.dir = "right";
            this.dashDir = "right"
            this.x = this.spawnPoint.x;
            this.y = this.spawnPoint.y;
            currentLevel = this.spawnPoint.level;
            this.lives = this.maxLives;
            resetLevel();
        }
    }
    handleSceneChanges(){
        let exitID = checkExitCollisions(this);
        if(exitID !== null && this.canChangeScene){
            this.activeExit = exitID;
            this.immobilityFrames = Infinity;
            this.sceneChangeAnimationFrame = 0;
            if(levels[currentLevel].sceneChanges[this.activeExit].dir === "left" || levels[currentLevel].sceneChanges[this.activeExit].dir === "right"){
                this.velocity.x = 0;
            }
            this.canChangeScene = false;
        }
        if(checkExitCollisions(this) === null && this.sceneChangeAnimationFrame > 75){
            this.canChangeScene = true;
        }
        if(this.sceneChangeAnimationFrame > 0 && this.sceneChangeAnimationFrame < 15){
            if(levels[currentLevel].sceneChanges[this.activeExit].dir === "left"){
                this.x -= this.maxSpeed;
                this.sceneChangeDir = "left";
            }
            if(levels[currentLevel].sceneChanges[this.activeExit].dir === "right"){
                this.x += this.maxSpeed;
                this.sceneChangeDir = "right";
            }
            if(levels[currentLevel].sceneChanges[this.activeExit].dir === "up"){
                this.velocity.y = 0;
                this.y -= blockSize / 4;
                this.sceneChangeDir = "up";
            }
            if(levels[currentLevel].sceneChanges[this.activeExit].dir === "down"){
                this.sceneChangeDir = "down";
            }
        }
        if(this.sceneChangeAnimationFrame === 20){
            this.sceneReenter.x = levels[currentLevel].sceneChanges[this.activeExit].x;
            this.sceneReenter.y = blockSize * levels[currentLevel].sceneChanges[this.activeExit].y;
            if(this.sceneChangeDir === "up" && levels[currentLevel].sceneChanges[this.activeExit].altX !== "none" && (player.dir === "left" || this.sceneReenter.x === "none")){
                this.sceneReenter.x = levels[currentLevel].sceneChanges[this.activeExit].altX;
                this.dir = "left";
                this.dashDir = "left";
            }
            this.sceneReenter.x *= blockSize;
            this.x = this.sceneReenter.x;
            this.y = this.sceneReenter.y;
            this.velocity.x = 0; 
            this.velocity.y = 0;
            currentLevel = levels[currentLevel].sceneChanges[this.activeExit].level;
            camera.x += player.x - (canvas.width / 2) + (player.width / 2) - camera.x;
            camera.y += player.y - (canvas.height / 2) + (player.height / 2) - camera.y;
            moveCamera();
            resetLevel();
            if(this.sceneChangeDir === "down" || this.sceneChangeDir === "up"){
                this.freezeFrames = 30;
                this.velocity.x = 0;
            }
        }
        if(this.sceneChangeAnimationFrame > 40 && this.sceneChangeAnimationFrame <= 70){
            if(this.sceneChangeDir === "left" || this.sceneChangeDir === "right"){
                let amountMoved = this.maxSpeed;
                if(this.sceneChangeDir === "left"){
                    amountMoved = -amountMoved;
                }
                this.velocity.x = amountMoved;
            }
        }
        if(this.sceneChangeAnimationFrame === 50 && this.sceneChangeDir === "down"){
            this.velocity.y = 0;
            this.immobilityFrames = 23;
        }
        if(this.sceneChangeAnimationFrame === 50 && this.sceneChangeDir === "up"){
            this.gravity = 75;
            this.x = this.sceneReenter.x;
            this.y = this.sceneReenter.y;
            this.velocity.y = -blockSize / 2.85;
            this.immobilityFrames = 60;
            this.inAir = Infinity;
            this.jumping = Infinity;
            this.canDoubleJump = false;
        }
        if(this.sceneChangeAnimationFrame >= 50 && this.sceneChangeAnimationFrame <= 68 && this.sceneChangeDir === "up"){
            if(player.dir === "right"){
                this.velocity.x = blockSize / 9;
            } else if(player.dir === "left"){
                this.velocity.x = -blockSize / 9;
            }
        }
        if(this.sceneChangeAnimationFrame === 70 && this.sceneChangeDir !== "up" && this.sceneChangeDir !== "down"){
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
const player = new Player(blockSize * 5, blockSize * 28, blockSize, blockSize*2)

class Block {
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height; 
    } 
    draw(){
        ctx.fillStyle = "rgb(0,0,0)";
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
        ctx.fillStyle = "rgb(255, 68, 0)";
        ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
    }
}

class Anchor {
    constructor(x, y, width, height, id){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height; 
        this.id = id;
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

class Particle {
    constructor(x, y, radius, color, opacity, name, xVelocity, yVelocity, xFriction, yFriction, life, gravity, bounciness, collisions, dilation, opacityChange){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.hitbox = {
            x: this.x - this.radius,
            y: this.y - this.radius,
            width: this.radius * 2,
            height: this.radius * 2
        }
        this.color = color;
        this.opacity = opacity;
        this.name = name;
        this.velocity = {
            x: xVelocity,
            y: yVelocity
        };
        this.friction = {
            x: xFriction,
            y: yFriction
        }
        this.life = life;
        this.gravity = gravity;
        this.bounciness = bounciness;
        this.collisions = collisions;
        this.dilation = dilation;
        this.opacityChange = opacityChange;
    }
    draw(){
        ctx.beginPath();
        ctx.moveTo(this.x - camera.x, this.y - camera.y);
        ctx.arc(this.x - camera.x, this.y - camera.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
    update(){
        this.hitbox = {
            x: this.x - this.radius,
            y: this.y - this.radius,
            width: this.radius * 2,
            height: this.radius * 2
        }
        this.velocity.y += this.gravity;
        if(this.velocity.y > player.maxGravity){
            this.velocity.y = player.maxGravity;
        }
        this.opacity += this.opacityChange;
        this.radius *= this.dilation;
        this.x += this.velocity.x;
        this.hitbox.x += this.velocity.x;
        this.velocity.x *= this.friction.x;
        if(checkBlockCollisions(this.hitbox) && this.collisions > 0){
            if(this.velocity.x > 0){
                while (checkBlockCollisions(this.hitbox)){
                    this.x--;
                    this.hitbox.x--;
                }
            } else{
                while (checkBlockCollisions(this.hitbox)){
                    this.x++;
                    this.hitbox.x++;
                }
            }
            if(this.collisions === 1){
                this.velocity.x = 0;
            } else if(this.collisions === 2){
                this.velocity.x = -this.velocity.x;
            }
        }
        this.y += this.velocity.y;
        this.y = Math.round(this.y);
        this.hitbox.y += this.velocity.y;
        this.hitbox.y = Math.round(this.hitbox.y);
        this.velocity.y *= this.friction.y;
        if(checkBlockCollisions(this.hitbox) && this.collisions > 0){
            if(this.velocity.y > 0){
                while (checkBlockCollisions(this.hitbox)){
                    this.y--;
                    this.hitbox.y--;
                }
            } else{
                while (checkBlockCollisions(this.hitbox)){
                    this.y++;
                    this.hitbox.y++;
                }
            }
            if(this.collisions === 1){
                this.velocity.y = 0;
            } else if(this.collisions === 2){
                this.velocity.y = -this.velocity.y * this.bounciness;
            }
        }
        if (Math.abs(this.velocity.x) < 0.1) {
            this.velocity.x = 0;
        }

        if (Math.abs(this.velocity.y) < 0.1) {
            this.velocity.y = 0;
        }
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
    ctx.fillText(debugText, blockSize * 0.75, blockSize * 3);
}

function drawBlocks(){
    //uncomment the following to test anchor positions
    /* 
    for(let i = 0; i < anchors.length; i++){
        anchors[i].draw();
    }
    */
    for(let i = 0; i < blocks.length; i++){
        blocks[i].draw();
    }
    for(let i = 0; i < lava.length; i++){
        lava[i].draw();
    }
    for(let i = 0; i < particles.length; i++){
        particles[i].draw();
    }
    
    player.draw();
}
function updateBlocks(){
    player.update();
    for(let i = particles.length - 1; i >= 0; i--){
        particles[i].life--;
        if(particles[i].life < 0 || particles[i].radius <= 0 || particles[i].opacity <= 0 || particles[i].radius <= 0 || particles[i].x < -particles.radius || particles[i].y < -particles.radius || particles[i].x > levelWidth + particles[i].radius || particles[i].y > levelHeight + particles[i].radius){
            particles.splice(i, 1);
        }
    }
    for(let i = 0; i < particles.length; i++){
        particles[i].update();
    }
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
                anchors.push(new Anchor(j * blockSize, i * blockSize - blockSize * 2, blockSize * levels[currentLevel].anchorWidths[anchorIndex], blockSize * 3, anchorIndex));
                anchorIndex++;
            }
            if(levels[currentLevel].map[i][j] === "|"){
                exits.push(new Exit(j * blockSize, i * blockSize, blockSize * levels[currentLevel].sceneChanges[exitIndex].width, blockSize * levels[currentLevel].sceneChanges[exitIndex].height));
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
    particles = [];
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
    let anchorX = player.anchor.x / blockSize;
    let anchorY = player.anchor.y / blockSize;
    let spawnX = player.spawnPoint.x / blockSize;
    let spawnY = player.spawnPoint.y / blockSize;
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    blockSize = Math.round(((innerWidth + innerHeight) / 2) / 20);
    rebuildLevel();
    player.width = blockSize;
    player.height = blockSize * 2;
    player.x = x * blockSize;
    player.y = y * blockSize;
    player.anchor.x = anchorX * blockSize;
    player.anchor.y = anchorY * blockSize;
    player.spawnPoint.x = spawnX * blockSize;
    player.spawnPoint.y = spawnY * blockSize;
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

function checkAnchorCollisions(object){
    for(let i = 0; i < anchors.length; i++){
        if(isColliding(object, anchors[i])){
            return anchors[i].id;
        }
    }
    return null;
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
    if(e.key === "ArrowLeft"){
        controls.left = true;
    }
    if(e.key === "ArrowRight"){
        controls.right = true;
    }
    if(e.key === "ArrowUp"){
        controls.up = true;
    }
    if(e.key === "ArrowDown"){
        controls.down = true;
    }
    if(e.key === "w"){
        controls.w = true;
    }
    if(e.key === "a"){
        controls.a = true;
    }
    if(e.key === "s"){
        controls.s = true;
    }
    if(e.key === "d"){
        controls.d = true;
    }
    if(e.key === " "){
        controls.space = true;
    }
});

window.addEventListener("keyup", (e) => {
    if(e.key === "ArrowLeft"){
        controls.left = false;
    }
    if(e.key === "ArrowRight"){
        controls.right = false;
    }
    if(e.key === "ArrowUp"){
        controls.up = false;
    }
    if(e.key === "ArrowDown"){
        controls.down = false;
    }
    if(e.key === "w"){
        controls.w = false;
    }
    if(e.key === "a"){
        controls.a = false;
    }
    if(e.key === "s"){
        controls.s = false;
    }
    if(e.key === "d"){
        controls.d = false;
    }
    if(e.key === " "){
        controls.space = false;
    }
});

document.addEventListener('pointerdown', (e) => {
    debugText = e.pointerType + ", " + e.button + ", " + e.buttons;
    if(e.pointerType !== "mouse"){
        return;
    }
    if(e.button === 0){
        controls.click = true;
    } else if(e.button === 2){
        controls.rightClick = true;
    }
})
document.addEventListener('pointerup', (e) => {
    if(e.button === 0){
        controls.click = false;
    } else if(e.button === 2){
        controls.rightClick = false;
    }
})
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
})
window.addEventListener('resize', () => {
    resizeCanvas();
})