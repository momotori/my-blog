const BOARD_SIZE = 4;
const BEST_SCORE_KEY = "game2048-best";
const SWIPE_THRESHOLD = 20;

let board = createEmptyBoard();
let score = 0;
let best = loadBestScore();
let isGameOver = false;
let hasWon = false;
let keepPlayingAfterWin = false;
let newTilePositions = [];
let mergedPositions = [];

const boardGridEl = document.getElementById("board-grid");
const boardTilesEl = document.getElementById("board-tiles");
const boardEl = document.getElementById("board");
const scoreCurrentEl = document.getElementById("score-current");
const scoreBestEl = document.getElementById("score-best");
const overlayEl = document.getElementById("overlay");
const overlayMessageEl = document.getElementById("overlay-message");
const btnKeepPlaying = document.getElementById("btn-keep-playing");
const btnRestart = document.getElementById("btn-restart");
const newGameBtn = document.getElementById("new-game-btn");

function createEmptyBoard() {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
}

function cloneBoard(source) {
  return source.map((row) => row.slice());
}

function boardsEqual(a, b) {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (a[r][c] !== b[r][c]) return false;
    }
  }
  return true;
}

function transpose(grid) {
  const result = createEmptyBoard();
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      result[c][r] = grid[r][c];
    }
  }
  return result;
}

function reverseRows(grid) {
  return grid.map((row) => row.slice().reverse());
}

function slideAndMergeLine(line) {
  const values = line.filter((value) => value !== 0);
  const mergedLine = [];
  const mergedMask = [];
  let gained = 0;
  let i = 0;
  while (i < values.length) {
    if (i + 1 < values.length && values[i] === values[i + 1]) {
      const merged = values[i] * 2;
      mergedLine.push(merged);
      mergedMask.push(true);
      gained += merged;
      i += 2;
    } else {
      mergedLine.push(values[i]);
      mergedMask.push(false);
      i += 1;
    }
  }
  while (mergedLine.length < BOARD_SIZE) {
    mergedLine.push(0);
    mergedMask.push(false);
  }
  return { line: mergedLine, mask: mergedMask, gained };
}

function moveBoard(sourceBoard, direction) {
  const needsTranspose = direction === "up" || direction === "down";
  const needsReverse = direction === "right" || direction === "down";

  let working = cloneBoard(sourceBoard);
  if (needsTranspose) working = transpose(working);
  if (needsReverse) working = reverseRows(working);

  let totalGained = 0;
  const resultLines = [];
  const maskLines = [];
  for (const row of working) {
    const { line, mask, gained } = slideAndMergeLine(row);
    resultLines.push(line);
    maskLines.push(mask);
    totalGained += gained;
  }

  let resultBoard = resultLines;
  let maskBoard = maskLines;
  if (needsReverse) {
    resultBoard = reverseRows(resultBoard);
    maskBoard = reverseRows(maskBoard);
  }
  if (needsTranspose) {
    resultBoard = transpose(resultBoard);
    maskBoard = transpose(maskBoard);
  }

  const moved = !boardsEqual(sourceBoard, resultBoard);
  return { board: resultBoard, mask: maskBoard, gained: totalGained, moved };
}

function maskToPositions(mask) {
  const positions = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (mask[r][c]) positions.push([r, c]);
    }
  }
  return positions;
}

function getEmptyCells(grid) {
  const cells = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (grid[r][c] === 0) cells.push([r, c]);
    }
  }
  return cells;
}

function addRandomTile(grid) {
  const emptyCells = getEmptyCells(grid);
  if (emptyCells.length === 0) return null;
  const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return [r, c];
}

function hasAvailableMoves(grid) {
  if (getEmptyCells(grid).length > 0) return true;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const value = grid[r][c];
      if (c + 1 < BOARD_SIZE && grid[r][c + 1] === value) return true;
      if (r + 1 < BOARD_SIZE && grid[r + 1][c] === value) return true;
    }
  }
  return false;
}

function hasWinningTile(grid) {
  return grid.some((row) => row.some((value) => value >= 2048));
}

function loadBestScore() {
  try {
    return Number(localStorage.getItem(BEST_SCORE_KEY)) || 0;
  } catch (e) {
    return 0;
  }
}

function saveBestScore() {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(best));
  } catch (e) {
    /* localStorage unavailable */
  }
}

function renderBackgroundGrid() {
  boardGridEl.innerHTML = "";
  for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    boardGridEl.appendChild(cell);
  }
}

function renderTiles() {
  boardTilesEl.innerHTML = "";
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const value = board[r][c];
      if (value === 0) continue;
      const tile = document.createElement("div");
      tile.className = "tile";
      if (value > 2048) tile.classList.add("tile-super");
      tile.dataset.value = String(value);
      tile.style.gridRow = String(r + 1);
      tile.style.gridColumn = String(c + 1);
      tile.textContent = String(value);
      if (newTilePositions.some(([nr, nc]) => nr === r && nc === c)) {
        tile.classList.add("tile-new");
      }
      if (mergedPositions.some(([mr, mc]) => mr === r && mc === c)) {
        tile.classList.add("tile-merged");
      }
      boardTilesEl.appendChild(tile);
    }
  }
}

function renderScoreboard(gained) {
  scoreCurrentEl.textContent = String(score);
  scoreBestEl.textContent = String(best);
  if (gained > 0) {
    const popup = document.createElement("span");
    popup.className = "score-popup";
    popup.textContent = `+${gained}`;
    scoreCurrentEl.parentElement.appendChild(popup);
    setTimeout(() => popup.remove(), 700);
  }
}

function render(gained = 0) {
  renderTiles();
  renderScoreboard(gained);
}

function showOverlay(message, { showKeepPlaying }) {
  overlayMessageEl.textContent = message;
  btnKeepPlaying.hidden = !showKeepPlaying;
  overlayEl.hidden = false;
}

function hideOverlay() {
  overlayEl.hidden = true;
}

function afterMove(gained) {
  if (score > best) {
    best = score;
  }
  saveBestScore();
  render(gained);

  if (!hasWon && hasWinningTile(board)) {
    hasWon = true;
    showOverlay("2048 달성!", { showKeepPlaying: true });
    return;
  }

  if (!hasAvailableMoves(board)) {
    isGameOver = true;
    showOverlay("게임 오버", { showKeepPlaying: false });
  }
}

function isInputBlocked() {
  if (isGameOver) return true;
  if (hasWon && !keepPlayingAfterWin) return true;
  return false;
}

function handleMove(direction) {
  if (isInputBlocked()) return;

  const { board: nextBoard, mask, gained, moved } = moveBoard(board, direction);
  if (!moved) return;

  board = nextBoard;
  mergedPositions = maskToPositions(mask);
  score += gained;

  const newTile = addRandomTile(board);
  newTilePositions = newTile ? [newTile] : [];

  afterMove(gained);
}

function startNewGame() {
  board = createEmptyBoard();
  score = 0;
  isGameOver = false;
  hasWon = false;
  keepPlayingAfterWin = false;
  mergedPositions = [];
  newTilePositions = [];

  const first = addRandomTile(board);
  const second = addRandomTile(board);
  newTilePositions = [first, second].filter(Boolean);

  hideOverlay();
  render(0);
}

function keepPlaying() {
  keepPlayingAfterWin = true;
  hideOverlay();
}

const KEY_DIRECTIONS = {
  ArrowLeft: "left",
  ArrowUp: "up",
  ArrowRight: "right",
  ArrowDown: "down",
};

function handleKeyDown(event) {
  const direction = KEY_DIRECTIONS[event.key];
  if (!direction) return;
  event.preventDefault();
  handleMove(direction);
}

let touchStartX = 0;
let touchStartY = 0;
let touchActive = false;

function handleTouchStart(event) {
  if (event.touches.length !== 1) return;
  touchActive = true;
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
  if (!touchActive) return;
  event.preventDefault();
}

function handleTouchEnd(event) {
  if (!touchActive) return;
  touchActive = false;
  const touch = event.changedTouches[0];
  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  if (Math.max(absDx, absDy) < SWIPE_THRESHOLD) return;

  if (absDx > absDy) {
    handleMove(dx > 0 ? "right" : "left");
  } else {
    handleMove(dy > 0 ? "down" : "up");
  }
}

function init() {
  renderBackgroundGrid();
  scoreBestEl.textContent = String(best);

  window.addEventListener("keydown", handleKeyDown);
  boardEl.addEventListener("touchstart", handleTouchStart, { passive: true });
  boardEl.addEventListener("touchmove", handleTouchMove, { passive: false });
  boardEl.addEventListener("touchend", handleTouchEnd);

  newGameBtn.addEventListener("click", startNewGame);
  btnRestart.addEventListener("click", startNewGame);
  btnKeepPlaying.addEventListener("click", keepPlaying);

  startNewGame();
}

init();
