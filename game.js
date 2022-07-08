import { draw as drawBrick } from "./bricks.js";
import { drawBall as addBall, moveBall as ballMovement, checkWallCollision, checkPadCollision, ballDirectionOne, ballDirectionTwo, deadBall} from "./ball.js";
import { createPad as addPad, movePadAndBall as move } from "./pad.js";

let lastRenderTime = 0;


function main(time) {

  requestAnimationFrame(main);
  const secondsSinceLastRender = (time - lastRenderTime) / 1000;
  if (secondsSinceLastRender < 1/6 ) return;
  lastRenderTime = time;
  ballMovement();
  checkWallCollision()
  checkPadCollision()
  deadBall()

}


requestAnimationFrame(main);

const gameBoard = document.getElementById("game-board");

drawBrick(gameBoard);
addBall(gameBoard);
addPad(gameBoard);
move();

