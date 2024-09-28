import "./style.css";

//1 Underpopulation: Any live cell with fewer than two live neighbors dies, as if by underpopulation.

//2 Survival: Any live cell with two or three live neighbors lives on to the next generation.

//3 Overpopulation: Any live cell with more than three live neighbors dies, as if by overpopulation.

//4 Reproduction: Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

const app = document.querySelector("#app");
const COLUMN_SIZE = 100;
const ROW_SIZE = 100;
let startGameInterval: number | undefined;

const grid = document.createElement("div");
grid.classList.add("board");
app?.appendChild(grid);

const startGameBtn = document.createElement("button");
const pauseGameBtn = document.createElement("button");
startGameBtn.classList.add("start", "game-btn");
pauseGameBtn.classList.add("pause", "game-btn", "hide");
startGameBtn.innerText = "start game";
pauseGameBtn.innerText = "pause game";
startGameBtn.addEventListener("click", createGridElements);
pauseGameBtn.addEventListener("click", pauseGame);
app?.appendChild(startGameBtn);
app?.appendChild(pauseGameBtn);

function startGame() {
  startGameInterval = setInterval(() => {
    nextGeneration();
  }, 200);
}

function pauseGame() {
  if (startGameInterval) {
    clearInterval(startGameInterval);
    pauseGameBtn.innerText = "continue";
    startGameInterval = undefined;
  } else {
    pauseGameBtn.innerText = "pause game";
    startGame();
  }
}

function createGridElements() {
  startGameBtn.classList.add("hide");
  pauseGameBtn.classList.remove("hide");

  for (let row = 0; row < ROW_SIZE; row++) {
    for (let col = 0; col < COLUMN_SIZE; col++) {
      const element = document.createElement("div");
      const randmoizer = Math.random() * 10;
      element.className = randmoizer > 8 ? "alive citizen" : "dead citizen";
      grid.appendChild(element);
    }
  }

  startGame();
}

const surroundings = (center: number) => {
  // right
  // left
  // top
  // bottom
  // top right
  // bottom right
  // top left
  // bottom left
  return [
    center + 1,
    center - 1,
    center - COLUMN_SIZE,
    center + COLUMN_SIZE,
    center - COLUMN_SIZE + 1,
    center + COLUMN_SIZE + 1,
    center - COLUMN_SIZE - 1,
    center + COLUMN_SIZE - 1,
  ];
};

function deadOrAlive(citizen: Element, index: number) {
  const isAlive = citizen.classList.contains("alive");
  const neighbours = surroundings(index);
  const citizens = grid.children;
  let liveNeighbours = 0;

  neighbours.forEach((neighbour) => {
    if (citizens[neighbour]?.classList.contains("alive")) {
      liveNeighbours += 1;
    }
  });

  //1 Underpopulation: Any live cell with fewer than two live neighbors dies, as if by underpopulation.
  //3 Overpopulation: Any live cell with more than three live neighbors dies, as if by overpopulation.
  if (isAlive && (liveNeighbours < 2 || liveNeighbours > 3)) {
    citizen.classList.remove("alive");
    citizen.classList.add("dead");
    return;
  }
  //2 Survival: Any live cell with two or three live neighbors lives on to the next generation.
  if (isAlive && (liveNeighbours == 2 || liveNeighbours == 3)) {
    return;
  }
  //4 Reproduction: Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
  if (!isAlive && liveNeighbours == 3) {
    citizen.classList.remove("dead");
    citizen.classList.add("alive");
    return;
  }
}

function nextGeneration() {
  const citizens = Array.from(grid.children);

  citizens.forEach((citizen: Element, i: number) => {
    deadOrAlive(citizen, i);
  });
}
