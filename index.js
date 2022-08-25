const state = {
  numCells: (600 / 40) * (600 / 40),
  cells: [],
  shipPosition: 217,
  gameOver: false,
  score: 0,
  alienPositions: [
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56
  ]
};

function setupGame(element) {
  // state.element is equivalent to .app in html
  state.element = element;
  // do the necessary steps to draw the game
  // draw the grid
  drawGrid();
  // draw the spaceship
  drawSpaceShip();
  // draw the aliens
  drawAliens();
  // draw the score board
  drawScoreBoard();
}

function drawGrid() {
  // create the containing elements
  const grid = document.createElement("div");
  grid.classList.add("grid");

  // create a LOT of cells - 15x15 (225)
  for (let i = 0; i < state.numCells; i++) {
    // create a cell
    const cell = document.createElement("div");
    // append cell to grid
    grid.append(cell);
    // store the cell in game state
    state.cells.push(cell);
  }
  // append the cells to the containing element and the containing element to the app
  state.element.append(grid);
}

function drawSpaceShip() {
  // find the bottom row, middle cell (from game state) and a background image.
  state.cells[state.shipPosition].classList.add("spaceship");
}

function drawAliens() {
  // adding the aliens to the grid => we need to store the positions of the aliens in our game state
  // loop through the cells. cell is the current element (singular of the array) in the array being processed and the index is the index of the cell
  state.cells.forEach((cell, index) => {
    // remove any alien images
    if (cell.classList.contains("alien")) {
      cell.classList.remove("alien");
    }
    // add the image to the cell if the index is in the set of alien position
    if (state.alienPositions.includes(index)) {
      cell.classList.add("alien");
    }
  });
}

function controlShip(event) {
  if (state.gameOver) {
    return;
  } else {
    // if left key is pressed
    if (event.code === "ArrowLeft") {
      moveShip("left");
    }
    // if right key
    else if (event.code === "ArrowRight") {
      moveShip("right");
    }
    // if space
    else if (event.code === "Space") {
      fire();
    }
  }
}

function fire() {
  // use an interval: run some code repeatedly each time after a specific time
  let interval;
  // laser starts at the ship position
  let laserPosition = state.shipPosition;
  interval = setInterval(() => {
    // remove the laser image
    state.cells[laserPosition].classList.remove("laser");
    // decrease (move up a row) the laser position
    laserPosition -= 15;
    // check we are still in bounds
    if (laserPosition < 0) {
      clearInterval(interval);
      return;
    }

    // if there's an alien BOOM
    else if (state.alienPositions.includes(laserPosition)) {
      // clear the interval, remove alien from alien position, remove alien image and laser image
      clearInterval(interval);
      state.alienPositions.splice(
        state.alienPositions.indexOf(laserPosition),
        1
      );
      state.cells[laserPosition].classList.remove("alien", "laser");
      // add the explosion image for a set time and remove image after certain time
      state.cells[laserPosition].classList.add("explosion");
      // track scoring system
      state.score++;
      state.scoreElement.innerText = state.score;
      setTimeout(function () {
        state.cells[laserPosition].classList.remove("explosion");
      }, 200);
      return;
    }

    // add the laser image
    state.cells[laserPosition].classList.add("laser");
  }, 100);
}

function moveShip(direction) {
  // remove image from current position
  state.cells[state.shipPosition].classList.remove("spaceship");
  // figure out delta
  // add image to new position
  if (direction === "left" && state.shipPosition > 210) {
    state.shipPosition--;
    // drawSpaceShip();
  } else if (direction === "right" && state.shipPosition < 224) {
    state.shipPosition++;
  }
  drawSpaceShip();
}

function play() {
  // start the march of the aliens!
  let interval;
  // starting direction
  let direction = "right";
  interval = setInterval(() => {
    let movement;
    if (direction === "right") {
      // if right and at the edge, increase by 15, decrease 1
      if (atEdge("right")) {
        movement = 15 - 1;
        direction = "left";
      } else {
        // if right, increase position by 1
        movement = 1;
      }
    } else if (direction === "left") {
      // if left and at the edge, increase by 15, increase 1
      if (atEdge("left")) {
        movement = 15 + 1;
        direction = "right";
      } else {
        // if left, decrease position by 1
        movement = -1;
      }
    }
    // update the alien position
    state.alienPositions = state.alienPositions.map(
      (position) => position + movement
    );
    // redraw aliens on page
    drawAliens();
    checkGameState(interval);
  }, 400);

  // set up the ship controls
  window.addEventListener("keydown", controlShip);
}

function atEdge(side) {
  if (side === "left") {
    // are any of the aliens in the left hand column?
    return state.alienPositions.some((position) => position % 15 === 0);
  } else {
    // are any of the aliens in the right hand column?
    return state.alienPositions.some((position) => position % 15 === 14);
  }
}

function checkGameState(interval) {
  // has the alient reached the bottom?
  if (state.alienPositions.some((position) => position >= state.shipPosition)) {
    // end the game and make ship go BOOM
    clearInterval(interval);
    state.cells[state.shipPosition].classList.remove("spaceship");
    state.cells[state.shipPosition].classList.add("explosion");
    // disable ship
    state.gameOver = true;
    // game message
    drawMessage("GAME OVER!");
  }
  // are the aliens all dead?
  else if (state.alienPositions.length === 0) {
    // end the game
    // stop the interval
    clearInterval(interval);
    state.gameOver = true;
    drawMessage("HUMAN WINS!");
  }
}

function drawMessage(message) {
  // create message
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  // create heading text
  const heading1 = document.createElement("h1");
  heading1.innerText = message;
  messageElement.append(heading1);
  // append to the app
  state.element.append(messageElement);
}

function drawScoreBoard() {
  // add scoreboard text
  const scoreboard = document.createElement("div");
  scoreboard.classList.add("scoreboard");
  // add text - heading, para and heading3
  const heading = document.createElement("h1");
  heading.innerText = "Space Invaders";
  const para1 = document.createElement("p");
  para1.innerText = "Press SPACE to shoot.";
  const para2 = document.createElement("p");
  para2.innerText = "Press ← or → to move";
  // add scores
  const scoreElement = document.createElement("span");
  scoreElement.innerHTML = state.score;
  const heading3 = document.createElement("h3");
  heading3.innerText = "Score: ";
  heading3.append(scoreElement);
  scoreboard.append(heading, para1, para2, heading3);
  // append to the app
  state.scoreElement = scoreElement;
  state.element.append(scoreboard);
}

// query the page for the place to insert the game
const appElement = document.querySelector(".app");

// do the necessary steps to draw the game
setupGame(appElement);

// play the game - start being able to move the ship, move aliens
play();
