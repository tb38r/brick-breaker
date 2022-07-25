// gameboard variables
const gameBoard = document.querySelector(".game-board");
const gameBoardRect = gameBoard.getBoundingClientRect();
const gameCompStyles = window.getComputedStyle(gameBoard);

// paddle variables
const paddle_width = 100;
const paddle_margin_bottom = 50;
const paddle_height = 20;

const pad = document.createElement("div");
const padCompStyles = window.getComputedStyle(pad);

let paddle = {
  // start is used to track the translated values
  start: 0,
  x: gameBoardRect.width / 2 - paddle_width / 2,
  // y value is the top left corner value of the paddle
  y: gameBoardRect.height - paddle_margin_bottom - paddle_height,
  width: paddle_width,
  height: paddle_height,
  xMovement: 20,
  right: false,
  left: false,
};

// ball variables
const ballDiv = document.createElement("div");
const ballRadius = 10;
const ballCompStyles = window.getComputedStyle(ballDiv);
const defaultValue = "translate(0,0)";
ballDiv.setAttribute('transform', defaultValue);

//brick variables
const brick = document.createElement("div");
const docFrag = document.createDocumentFragment();

//game start boolean
let game_started = false;

// gameover - no lives left
let game_over = false
//scoreboard
let scoreboard = document.querySelector(".scoreboard");
let score = 0;

//lives
let maxlives = 3;
let livesbox = document.querySelector(".lives");
livesbox.innerHTML = "&#10084".repeat(maxlives);

//pause state
let paused = false;
const pausediv = document.getElementById("pauseDiv");
// gameBoard.append(pausediv);

// draw paddle
function drawPaddle() {
  pad.classList.add("pad");
  pad.style.left = paddle.x + "px";
  pad.style.top = paddle.y + "px";
  pad.style.width = paddle.width + "px";
  pad.style.height = paddle.height + "px";
  pad.style.backgroundColor = "white";
  pad.style.position = "absolute";
  gameBoard.append(pad);
}

//toggles boolean used within movePaddle function
function movePaddleBool() {
  document.addEventListener("keydown", function (event) {
    const padRect = pad.getBoundingClientRect();

    if (event.key == "ArrowRight" && padRect.right + parseInt(gameCompStyles.border) < gameBoardRect.right) {
      event.preventDefault();
      paddle.right = true;
    } else if (event.key == "ArrowLeft" && padRect.left - parseInt(gameCompStyles.border) > gameBoardRect.left) {
      event.preventDefault();
      paddle.left = true;
    }
  });
}

//translates paddle on the X axis
function movePaddle() {
  if (paddle.right) {
    paddle.start += paddle.xMovement;

    if (!game_started) {
      ballDiv.style.transform = `translateX(${paddle.start}px)`;
      pad.style.transform = `translateX(${paddle.start}px)`;
      paddle.right = false;
    }

    pad.style.transform = `translate(${paddle.start}px)`;
    paddle.right = false;
  }

  if (paddle.left) {
    paddle.start -= paddle.xMovement;
    if (!game_started) {
      ballDiv.style.transform = `translate(${paddle.start}px)`;
      pad.style.transform = `translate(${paddle.start}px)`;
      paddle.left = false;
    }

    pad.style.transform = `translate(${paddle.start}px)`;
    paddle.left = false;
  }
}

const ball = {
  x: gameBoardRect.width / 2 - ballRadius,
  y: paddle.y - 2 * ballRadius,
  // the speed value can eventually change
  speed: 5,
  radius: ballRadius,
  // these are the properties that x and y change by.
  deltaX: 4 * (Math.random() * 2 - 1),
  deltaY: -4,
};

function drawBall() {
  ballDiv.classList.add("ball");
  ballDiv.style.top = ball.y + "px";
  ballDiv.style.left = ball.x + "px";
  ballDiv.style.height = "20px";
  ballDiv.style.width = "20px";
  ballDiv.style.borderRadius = "10px";
  ballDiv.style.position = "absolute";
  ballDiv.style.backgroundColor = "silver";
  gameBoard.append(ballDiv);
}

function moveBall() {
  ball.x += ball.deltaX;
  ball.y += ball.deltaY;
}

function ballStart() {
  const padRect = pad.getBoundingClientRect();
  ball.x += paddle.xMovement;
}

// CHECK WHY WE NEED THESE VARIABLES
function ballWallCollision() {
  //tried make the below two variables global but causes errors
  const ballRect = ballDiv.getBoundingClientRect();
  const padRect = pad.getBoundingClientRect();

  // collided with right side
  if (ballRect.right + parseInt(gameCompStyles.border) >= gameBoardRect.right) {
    ball.deltaX = -Math.abs(ball.deltaX);
  }
  // collided with top
  if (ballRect.top - parseInt(gameCompStyles.border) <= gameBoardRect.top) {
    ball.deltaY = Math.abs(ball.deltaY);
  }

  // collided with left
  if (ballRect.left - parseInt(gameCompStyles.border) <= gameBoardRect.left) {
    ball.deltaX = Math.abs(ball.deltaX);
  }

  // if the ball hits goes past the paddle (i.e lose a life), all the logic for what happens should be here
  if (ballRect.top > padRect.bottom) {

    // reset the ball to middle of pad
    ball.x = gameBoardRect.width / 2 - ballRadius
    ball.y = paddle.y - 2 * ballRadius
    ballDiv.style.transform = `translateX(${paddle.start}px)`
    maxlives -= 1
    livesbox.innerHTML = "&#10084".repeat(maxlives);
    game_started = false

  }
}

function gameOver() {
  const youLoseDiv = document.querySelector('#game-over')
  let scoreSpan = document.querySelector('#final-score')
  let resetGameSpan = document.querySelector('#reset')
  if (maxlives === 0) {
    game_over = true
    youLoseDiv.style.display = "flex";
    scoreSpan.innerHTML = `Score:${score}`
    resetGameSpan.addEventListener('click', () => {
      window.location.reload('true')
    })
  }
}

function padCollision() {
  //also tried making the below two variables global but causes errors
  const ballRect = ballDiv.getBoundingClientRect();
  const padRect = pad.getBoundingClientRect();

  //added + ballRect.height
  if (
    ballRect.x < padRect.x + padRect.width &&
    ballRect.x > padRect.x &&
    padRect.y < padRect.y + padRect.height &&
    ballRect.y + ballRect.height > padRect.y
  ) {
    // CHECK WHERE THE ballRect HIT THE PADDLE
    let collidePoint = ballRect.x - (padRect.x + padRect.width / 2);

    // NORMALIZE THE VALUES
    collidePoint = collidePoint / (padRect.width / 2);

    // CALCULATE THE ANGLE OF THE ballRect
    let angle = (collidePoint * Math.PI) / 3;

    ball.deltaX = ball.speed * Math.sin(angle);
    ball.deltaY = -ball.speed * Math.cos(angle);
  }
}

//brick variables
const brick_width = 60;
const brick_height = 20;
const brick_rows = 3;
const brick_column = 5;
const brick_buffer = (gameBoardRect.width - brick_width * brick_rows) / brick_rows - 2;
let styleLeft = 35;
let styleTop = 50;

let bricks = {
  width: brick_width,
  height: brick_height,
  rows: brick_rows,
  columns: brick_column,
  style_left: styleLeft,
  style_top: styleTop,
};

function createBricks() {
  let id = 1;

  for (let i = 0; i < bricks.columns; i++) {
    for (let i = 0; i < bricks.rows; i++) {
      let brick = document.createElement("div");
      brick.classList.add("brick");
      brick.style.left = styleLeft + "px";
      brick.style.top = styleTop + "px";
      brick.style.height = bricks.height + "px";
      brick.style.width = bricks.width + "px";
      brick.style.backgroundColor = "pink";
      brick.style.position = "absolute";
      brick.id = id;
      id++;

      styleLeft += brick_width + brick_buffer;
      docFrag.appendChild(brick);
    }
    styleLeft = 35;
    styleTop += 25;
  }

  return docFrag;
}
function drawBricks() {
  let brickFrags = createBricks();
  gameBoard.appendChild(brickFrags);
}

function brickCollision() {
  let gameBricks = document.getElementsByClassName("brick");

  for (let i = 0; i < gameBricks.length; i++) {
    const ballRect = ballDiv.getBoundingClientRect();

    //bottom of brick collision
    if (
      ball.deltaY < 0 &&
      ballRect.bottom + ballRect.height > gameBricks[i].getBoundingClientRect().bottom &&
      ballRect.top <= gameBricks[i].getBoundingClientRect().bottom &&
      ballRect.left > gameBricks[i].getBoundingClientRect().left - ballRect.width &&
      ballRect.right < gameBricks[i].getBoundingClientRect().right + ballRect.width
    ) {
      score += 1;
      gameBricks[i].remove();
      ball.deltaY = Math.abs(ball.deltaY);

      //top of brick collison
    } else if (
      ball.deltaY > 0 &&
      ballRect.top < gameBricks[i].getBoundingClientRect().top &&
      ballRect.bottom >= gameBricks[i].getBoundingClientRect().top &&
      ballRect.left > gameBricks[i].getBoundingClientRect().left - ballRect.width &&
      ballRect.right < gameBricks[i].getBoundingClientRect().right + ballRect.width
    ) {
      score += 1;
      gameBricks[i].remove();
      ball.deltaY = -Math.abs(ball.deltaY);

      //left of brick collision
    } else if (
      ballRect.left < gameBricks[i].getBoundingClientRect().left &&
      ballRect.right > gameBricks[i].getBoundingClientRect().left &&
      ((ballRect.top + ballRect.height > gameBricks[i].getBoundingClientRect().top &&
        ballRect.bottom <= gameBricks[i].getBoundingClientRect().bottom) ||
        (ballRect.bottom - ballRect.height < gameBricks[i].getBoundingClientRect().bottom &&
          ballRect.bottom < gameBricks[i].getBoundingClientRect().top))
    ) {
      console.log("hit left");
      score += 1;

      ball.deltaX = Math.abs(ball.deltaX) * -1;

      //right of brick collision
    } else if (
      ballRect.right > gameBricks[i].getBoundingClientRect().right &&
      ballRect.left < gameBricks[i].getBoundingClientRect().right &&
      ((ballRect.top < gameBricks[i].getBoundingClientRect().bottom && ballRect.bottom > gameBricks[i].getBoundingClientRect().bottom) ||
        (ballRect.bottom > gameBricks[i].getBoundingClientRect().top && ballRect.top < gameBricks[i].getBoundingClientRect().top))
    ) {
      console.log("hit right");
      score += 1;

      ball.deltaX = Math.abs(ball.deltaX) * -1;
    }
  }
}

function togglePause() {
  if (!paused) {
    pausediv.style.display = "block";
    paused = true;
  } else if (paused) {
    pausediv.style.display = "none";
    paused = false;
    gameLoop();
  }
}

window.addEventListener("keydown", function (e) {
  e.preventDefault();
  if (e.code === "KeyP") togglePause();
});

window.addEventListener("keydown", function (e) {
  e.preventDefault();
  if (e.code === "Space") game_started = true;
});

//behaves funky within the game loop, frames stable nevertheless
drawBricks();