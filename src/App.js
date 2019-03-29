import React, { Component } from 'react';

import './App.css';

class App extends React.Component {
  constructor(){
    super();
        this.state = {
            display: "menu"
        };
}
gameInit(){
    let liveShow = document.getElementById('lives');
    let canvas = document.getElementById("cnv");
    let ctx = canvas.getContext("2d");
    let ballRadius = 4;
    let x = canvas.width/2;
    let y = canvas.height-30;
    let dx = 2;
    let dy = -2;
    let paddleHeight = 5;
    let paddleWidth = 35;
    let paddleX = (canvas.width-paddleWidth)/2;
    let rightPressed = false;
    let leftPressed = false;
    let brickRowCount = 8;
    let brickColumnCount = 10;
    let brickWidth = 30;
    let brickHeight = 5;
    let brickPadding = 2;
    let brickOffsetTop = 10;
    let brickOffsetLeft = 14;
    let lives = 5;
    let score = 0;
    let bricks = [];
    let lt = document.getElementById('lt');
    let rt = document.getElementById('rt');
    for(let c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(let r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    lt.addEventListener("touchstart", ()=>{
      leftPressed = true;
    })
    lt.addEventListener("touchend", ()=>{
      leftPressed = false;
    })
    rt.addEventListener("touchstart", ()=>{
      rightPressed = true;
    })
    rt.addEventListener("touchend", ()=>{
      rightPressed = false;
    })
    function keyDownHandler(e) {
        if(e.keyCode == 39) {
            rightPressed = true;
        }
        else if(e.keyCode == 37) {
            leftPressed = true;
        }
    }
    function keyUpHandler(e) {
        if(e.keyCode == 39) {
            rightPressed = false;
        }
        else if(e.keyCode == 37) {
            leftPressed = false;
        }
    }
    function collisionDetection() {
        for(let c=0; c<brickColumnCount; c++) {
            for(let r=0; r<brickRowCount; r++) {
                let b = bricks[c][r];
                if(b.status == 1) {
                    if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score+=125;
                        document.getElementById('score').innerHTML = score;
                        if(score == brickRowCount*brickColumnCount) {
                            alert("YOU WIN, CONGRATS!");
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }
    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = "#FFF";
        ctx.fill();
        ctx.closePath();
    }
    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.closePath();
    }
    
    function drawBricks() {
        for(let c=0; c<brickColumnCount; c++) {
            for(let r=0; r<brickRowCount; r++) {
                if(bricks[c][r].status == 1) {
                    let brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                    let brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#fff";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
    function livesCompare(){
      if(lives === 4){
        return ('&#9679;&#9679;&#9679;&#9679;')
      }
      if(lives === 3){
        return ('&#9679;&#9679;&#9679;')
      }
      if(lives === 2){
        return ('&#9679;&#9679;')
      }
      if(lives === 1){
        return ('&#9679;')
      }
      if(lives === 0){
        return ('')
      }
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        collisionDetection();
        if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if(y + dy < ballRadius) {
            dy = -dy;
        }
        else if(y + dy > canvas.height-ballRadius) {
            if(x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            }
            else {
                lives--;
                liveShow.innerHTML =livesCompare(); //sorry for this shit-method
                if(!lives) {
                alert('pizda');
                document.location.reload();
                }
                else {
                    x = canvas.width/2;
                    y = canvas.height-30;
                    dx = 2;
                    dy = -2;
                    paddleX = (canvas.width-paddleWidth)/2;
                }
            }
        }
        if(rightPressed && paddleX < canvas.width-paddleWidth) {
            paddleX += 7;
        }
        else if(leftPressed && paddleX > 0) {
            paddleX -= 7;
        }
        x += dx;
        y += dy;
        requestAnimationFrame(draw);
    }
    draw();
}
  startGame(){
    this.setState ({display: "game"})
  }
  mainMenu(){
    this.setState({display: "menu"})
  }
  aboutMenu(){
    this.setState({display: "about"})
  }
  render() {
    if (this.state.display === "menu"){
    return (
      <div className="App">
      <div className="menu">
        <h1>BREAK//OUT</h1>
        <a onClick={this.startGame.bind(this)}>PLAY</a>
        <a onClick={this.aboutMenu.bind(this)}>ABOUT</a>
        </div>
      </div>
    );
  }else if(this.state.display ==="game"){
    return (
      <div className="App">
        <div className="game">
        <h3 id="lives"> &#9679;&#9679;&#9679;&#9679;&#9679;</h3>
        <h4 id="score">0</h4>
       <canvas id="cnv" width="280" height="420"></canvas>
       <a className="startbtn" id="start"onClick={() => {
         document.getElementById('start').style.display ="none";
         this.gameInit()
        }
         }>START</a>
       <div className="mobile-controller">
            <a id="lt">&lt;</a>
            <a id="rt">&gt;</a>
            </div>
       </div>
      </div>
    )
  }else if(this.state.display ==="about"){
    return (
    <div className="App">
    <div className="About">
    <h2>About</h2>
    <p>This is demo-version of Breakout game, originaly perfomed by "Atari" long ago...<br/>
      Done by me (partly).
    </p>
    <a onClick={this.mainMenu.bind(this)}>Go Back</a>
    </div>
    </div>
    )
  }
}
}
export default App;
//fuck the "true" component-oriented structure