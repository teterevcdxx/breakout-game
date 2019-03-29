import React from "react"
import './index.css'

export default class Game extends React.Component {
    constructor(){
        super();
        this.canvas = document.getElementById("Canvas");
        this.ctx = this.canvas.getContext("2D");
        this.ballRadius = 10;
        this.x = this.canvas.width/2;
        this.y = this.canvas.height-30;
        this.dx = 2;
        this.dy = -2;
        this.paddleHeight = 5;
        this.paddleWidth = 20;
        this.paddleX = (this.canvas.width-this.paddleWidth)/2;
        this.rightPressed = false;
        this.leftPressed = false;
        this.brickRowCount = 5;
        this.brickColumnCount = 3;
        this.brickWidth = 20;
        this.brickHeight = 4;
        this.brickPadding = 5;
        this.brickOffsetTop = 30;
        this.brickOffsetLeft = 30;
        this.score = 0;
        this.lives = 3;
        this.bricks = [];

        this.state = {
            display: "game"
        };
    }
    componentDidMount(){
        this.gameInit();
    }
        gameInit(){
            for(var c=0; c<this.brickColumnCount; c++) {
                this.bricks[c] = [];
                for(var r=0; r<this.brickRowCount; r++) {
                    this.bricks[c][r] = { x: 0, y: 0, status: 1 };
                }
            }
            document.addEventListener("keydown", keyDownHandler, false);
            document.addEventListener("keyup", keyUpHandler, false);
            function keyDownHandler(e) {
                if(e.keyCode == 39) {
                    this.rightPressed = true;
                }
                else if(e.keyCode == 37) {
                    this.Pressed = true;
                }
            }
            function keyUpHandler(e) {
                if(e.keyCode == 39) {
                    this.rightPressed = false;
                }
                else if(e.keyCode == 37) {
                    this.leftPressed = false;
                }
            }
            function collisionDetection() {
                for(var c=0; c<this.brickColumnCount; c++) {
                    for(var r=0; r<this.brickRowCount; r++) {
                        var b = this.bricks[c][r];
                        if(b.status == 1) {
                            if(this.x > b.x && this.x < b.x+this.brickWidth && this.y > b.y && this.y < b.y+this.brickHeight) {
                                this.dy = -this.dy;
                                b.status = 0;
                                this.score++;
                                if(this.score == this.brickRowCount*this.brickColumnCount) {
                                    alert("YOU WIN, CONGRATS!");
                                    document.location.reload();
                                }
                            }
                        }
                    }
                }
            }
            function drawBall() {
                this.ctx.beginPath();
                this.ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI*2);
                this.ctx.fillStyle = "#fff";
                this.ctx.fill();
                this.ctx.closePath();
            }
            function drawPaddle() {
                this.ctx.beginPath();
                this.ctx.rect(this.paddleX, this.canvas.height-this.paddleHeight, this.paddleWidth, this.paddleHeight);
                this.ctx.fillStyle = "#fff";
                this.ctx.fill();
                this.ctx.closePath();
            }
            function drawBricks() {
                for(var c=0; c<this.brickColumnCount; c++) {
                    for(var r=0; r<this.brickRowCount; r++) {
                        if(this.bricks[c][r].status == 1) {
                            let brickX = (r*(this.brickWidth+this.brickPadding))+this.brickOffsetLeft;
                            let brickY = (c*(this.brickHeight+this.brickPadding))+this.brickOffsetTop;
                            this.bricks[c][r].x = this.brickX;
                            this.bricks[c][r].y = this.brickY;
                            this.ctx.beginPath();
                            this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight);
                            this.ctx.fillStyle = "#0095DD";
                            this.ctx.fill();
                            this.ctx.closePath();
                        }
                    }
                }
            }
            function draw() {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                drawBricks();
                drawBall();
                drawPaddle();
                collisionDetection();
                if(this.x + this.dx > this.canvas.width-this.ballRadius || this.x + this.dx < this.ballRadius) {
                    this.dx = -this.dx;
                }
                if(this.y + this.dy < this.ballRadius) {
                    this.dy = -this.dy;
                }
                else if(this.y + this.dy > this.canvas.height-this.ballRadius) {
                    if(this.x > this.paddleX && this.x < this.paddleX + this.paddleWidth) {
                        this.dy = -this.dy;
                    }
                    else {
                        this.lives--;
                        if(!this.lives) {
                            alert("GAME OVER");
                            document.location.reload();
                        }
                        else {
                            this.x = this.canvas.width/2;
                            this.y = this.canvas.height-30;
                            this.dx = 3;
                            this.dy = -3;
                            this.paddleX = (this.canvas.width-this.paddleWidth)/2;
                        }
                    }
                }
                if(this.rightPressed && this.paddleX < this.canvas.width-this.paddleWidth) {
                    this.paddleX += 7;
                }
                else if(this.leftPressed && this.paddleX > 0) {
                    this.paddleX -= 7;
                }
                this.x += this.dx;
                this.y += this.dy;
                requestAnimationFrame(draw);
            }
            draw();
        }
    render(){
        this.gameInit();
        return(
            <div className="game">
           
            <div className="mobile-controller">
            <a id="lt">&lt;</a>
            <a id="rt">&gt;</a>
            </div>
            </div>
        )
    }
}