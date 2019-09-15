// JAVASCRIPT CODE //

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let frames = 0;

const sprite = new Image();
sprite.src = "img/sprite.png";

const GET_READY = 0;
const GAME = 1;
const GAME_OVER = 2;
const DEGREE = Math.PI / 180;


const state = {
    current: 0
};

// ctx.drawImage(sprite, 0 , 0);

//CLASSES
class GameObject {
    constructor(sX, sY, w, h, x, y) {
        this.sX = sX;
        this.sY = sY;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        // this.draw=this.draw.bind(this);
    }

    update() {
    }

    draw() {
        // console.log(ctx);
        // ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    }
}

class Bird extends GameObject {
    constructor(sX, sY, w, h, x, y) {
        super(sX, sY, w, h, x, y);
        this.animation = [
            {sX: 276, sY: 112},
            {sX: 276, sY: 139},
            {sX: 276, sY: 164},
            {sX: 276, sY: 139},
        ];
        this.frame = 0;
        this.gravity = 0.25;
        this.speed = 0;
        this.jump = 4.6;
        this.rotation = 0;
        this.radius = 12;
    }

    draw() {
        let bird = this.animation[this.frame];
        // console.log(bird);
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite, bird.sX, bird.sY, this.w,
            this.h, -this.w / 2, -this.h / 2, this.w, this.h);
        ctx.restore();
    }

    flap() {
        this.speed = -this.jump;
    }

    update() {
        let period = state.current === GET_READY ? 5 : 10;
        this.frame += frames % period === 0 ? 1 : 0;
        this.frame %= this.animation.length;
        if (state.current === GET_READY) {
            this.y = 150;
            this.rotation = 0;
        } else {
            this.speed += this.gravity;
            this.y += this.speed;
            if (this.y + this.h / 2 >= canvas.height - fg.h) {
                this.y = canvas.height - fg.h - this.h / 2;
                if (state.current === GAME) {
                    state.current = GAME_OVER;
                    this.speed = 0;
                }
            }

            if (this.speed >= this.jump) {
                this.rotation = 90 * DEGREE;
                this.frame = 1;
            } else {
                this.rotation = -25 * DEGREE
            }
        }
    }
}

class Pipes {
    constructor(sTopX, sTopY, sBottomX, sBottomY, w, h, x, y) {
        this.pipeTop = new GameObject(sTopX, sTopY, w, h, x, y);
        this.pipeBottom = new GameObject(sBottomX, sBottomY, w, h, x, y);
        this.position = [];
        this.dx = 2;
        this.maxYpos = -150;
        this.gap = 85;
        this.pipeTop.y = this.pipeBottom.y = this.maxYpos * (Math.random() + 1);
    }

    update() {
        if (state.current !== GAME) return;

        if (frames % 100 === 0) {
            this.position.push({
                x: canvas.width,
                y: this.maxYpos * (Math.random() + 1)
            })
        }
        for (let it of this.position) {

            let bottomPipeYPos = it.y + this.pipeBottom.h + this.gap;
            let leftBorderBird = bird.x - bird.radius;
            let rightBorderBird = bird.x + bird.radius;
            let topBorderBird = bird.y - bird.radius;
            let bottomBorderBird = bird.y + bird.radius;
            if ((rightBorderBird > it.x && leftBorderBird < it.x + this.pipeTop.w
                && bottomBorderBird > it.y && topBorderBird < it.y + this.pipeTop.h) || (
                (rightBorderBird > it.x && leftBorderBird < it.x + this.pipeTop.w
                    && bottomBorderBird > bottomPipeYPos && topBorderBird < bottomPipeYPos + this.pipeTop.h))) {
                state.current = GAME_OVER;
            }
            if (it.x + this.pipeTop.w <= 0) {
                this.position.shift()
            }
            it.x -= this.dx;
        }
    }

    draw() {
        for (let it of this.position) {

            let topYPos = it.y;
            let bottomYPos = it.y + this.pipeBottom.h + this.gap;

            ctx.drawImage(sprite, this.pipeTop.sX, this.pipeTop.sY, this.pipeTop.w, this.pipeTop.h,
                it.x, topYPos, this.pipeTop.w, this.pipeTop.h);
            ctx.drawImage(sprite, this.pipeBottom.sX, this.pipeBottom.sY, this.pipeBottom.w,
                this.pipeBottom.h, it.x, bottomYPos, this.pipeBottom.w, this.pipeBottom.h);

        }
    };

}

//bird
const bird = new Bird(0, 0, 34, 25, 50, 150,);

// const bird = {
//     animation: [
//         {sX: 276, sY: 112},
//         {sX: 276, sY: 139},
//         {sX: 276, sY: 164},
//         {sX: 276, sY: 139},
//     ],
//     x: 50,
//     y: 150,
//     w: 34,
//     h: 25,
//     frame: 0,
//     draw: function () {
//         let bird = this.animation[this.frame];
//
//         ctx.drawImage(sprite, bird.sX, bird.sY, this.w,
//             this.h, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
//     }
//
// };

//background
const bg = new GameObject(0, 0, 275, 226, 0, canvas.height - 226);//draw x2

// const bg = {
//     sX: 0,
//     sY: 0,
//     w: 275,
//     h: 226,
//     x: 0,
//     y: canvas.height - 226,
//
//
//     draw: function () {
//         console.log("Draw",sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
//         ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
//         ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
//
//     }
// };
//
// bg.draw = function () {
//     // console.log("Draw",sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
//     ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
//     ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
// };

//foreground
const fg = new GameObject(276, 0, 224, 112, 0, canvas.height - 112);
fg.dx = 2;
fg.update = function () {
    if (state.current === GAME) {
        this.x = (this.x - this.dx) % (this.w / 2);
    }
}
//get ready
const getReady = new GameObject(0, 228, 173, 152, canvas.width / 2 - 173 / 2, 80);


//game over message
const gameOverMsg = new GameObject(175, 228, 225, 202, canvas.width / 2 - 225 / 2, 90);

getReady.draw = gameOverMsg.draw = function () {
    // if (state.current === GET_READY) {
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    // }
};
//pipes
const pipes = new Pipes(553, 0, 502, 0, 53, 400, canvas.width, 0);
// const pipeTop = new GameObject(553, 0, 53, 400, canvas.width);
// const pipeBottom = new GameObject(502, 0, 53, 400, canvas.width);


//  = function () {
//     // if (state.current === GAME_OVER) {
//     ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
//     // }
// };

//event listener
canvas.addEventListener("click", (e) => {
    switch (state.current) {
        case GET_READY:
            state.current = GAME;
            break;
        case GAME:
            bird.flap();
            break;
        case GAME_OVER:
            state.current = GET_READY;
            break;
    }
    console.log(state);
});


// console.log(bg)
//;

//DRAWING
function draw() {
    ctx.fillStyle = "#70c5ec";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    if (state.current === GET_READY) {
        getReady.draw();
    }
    if (state.current === GAME_OVER) {
        gameOverMsg.draw()
    }
    // bg.draw();

}

function update() {
    bird.update();
    fg.update();
    pipes.update();
}

function loop() {
    update();
    draw();
    frames++;
    requestAnimationFrame(loop)
}

loop();