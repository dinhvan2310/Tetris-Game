const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const ROW = 18;
const COL = 10;
const SQ  = 40;
const COLOR = "WHITE";
let score = 0;
let speed = 1000;

function drawSquare (x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect (x*SQ, y*SQ, SQ, SQ);

  ctx.strokeStyle = "#ccc";
  ctx.strokeRect (x*SQ, y*SQ, SQ, SQ);
}

let board = [];
for (r = 0; r < ROW; r++) {
  board[r] = [];
  for (c = 0; c < COL; c++) {
    board[r][c] = COLOR;
  }
}

console.log (board);

function drawBoard () {
  for (r = 0; r < ROW; r++) {
    for (c = 0; c < COL; c++) {
      drawSquare (c, r, board[r][c]);
    }
  }
}

drawBoard();

class Piece {
  constructor (tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;

    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];

    this.x = 3;
    this.y = -2;
  }

  fill(color) {
    for (let r = 0; r < this.activeTetromino.length; r++) {
      for (let c = 0; c < this.activeTetromino.length; c++) {
        if (this.activeTetromino[r][c]) {
          drawSquare (this.x + c, this.y + r, color);
        }
      }
    }
  }

  draw () {
    this.fill (this.color);
  }

  unDraw () {
    this.fill (COLOR);
  }

  moveDown () {
    if (!this.collision (0, 1, this.activeTetromino)) {
      this.unDraw ();
      this.y++;
      this.draw ();
    } else {
      this.lock();
      p = randomPiece ();
    }
  }

  moveLeft () {
    if (!this.collision (-1, 0, this.activeTetromino)) {
      this.unDraw ();
      this.x--;
      this.draw ();
    }
  }

  moveRight () {
    if (!this.collision (1, 0, this.activeTetromino)) {
      this.unDraw ();
      this.x++;
      this.draw ();
    }
  }

  lock () {
    for (let r = 0; r < this.activeTetromino.length; r++) {
      for (let c = 0; c < this.activeTetromino.length; c++) {
        if (!this.activeTetromino[r][c]) {
          continue;
        }

        if (this.y + r < 0) {
          alert ("GAME OVER!");
          gameOver = true;
          break;
        }

        board[this.y + r][this.x + c] = this.color;

      }
    }

    // Xu ly an diem
    for (let r = 0; r < ROW; r++) {
      let isFull = true;
      for (let c = 0; c < COL; c++) {
        isFull = isFull && (board[r][c] != COLOR);
      }

      if (isFull) {
        for (let y = r; y > 1; y--) {
          for (let c = 0; c< COL; c++) {
            board[y][c] = board[y - 1][c];
          }
        }

        for (let c = 0; c< COL; c++) {
          board[0][c] = COLOR;
        }
        score += 10;
        if (score % 40 === 0) {
          speed -= 200;
          drop ();
        }
      }
    }
    drawBoard ();
    document.querySelector('#score').innerText = score;
  }

  rotate () {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];

    let move = 0;
    if (this.collision (0, 0, nextPattern)) {
      if (this.x > COL / 2) {
        move = -1;
      } else {
        move = 1;
      }
    }

    if (!this.collision (0, 0, nextPattern)) {
      this.unDraw ();
      this.x += move;
      this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
      this.activeTetromino = this.tetromino [this.tetrominoN];
      this.draw ();
    }
  }

  collision (x, y, piece) {
    for (let r = 0; r < piece.length; r++) {
      for (let c = 0; c < piece.length; c++) {
        if (!piece[r][c]) {
          continue;
        } 

        let newX = this.x + c + x;
        let newY = this.y + r + y;

        if (newX < 0 || newX >= COL || newY >= ROW) {
          return true;
        }

        if (newY < 0) {
          continue;
        }

        if (board[newY][newX] != COLOR) {
          return true;
        }

      }
    }
    return false;
  }

}

const PIECES = [
  [Z, "red"],
  [S, "green"],
  [T, "yellow"],
  [O, "blue"],
  [L, "purple"],
  [I, "cyan"],
  [J, "orange"],
];

function randomPiece () {
  let r = Math.floor(Math.random() * PIECES.length);
  return new Piece (PIECES[r][0], PIECES[r][1]);
}

let p = randomPiece();
console.log (p);

document.addEventListener ('keydown', function (e) {
  if (e.key == 'ArrowLeft') {
    p.moveLeft ();
  } else if (e.key == 'ArrowRight') {
    p.moveRight ();
  } else if (e.key == 'ArrowUp') {
    p.rotate ();
  } else if (e.key == 'ArrowDown') {
    p.moveDown ();
  }
})

let gameOver = false;
let interval;

function drop () {
  interval = setInterval (function () {
    if (!gameOver) {
      p.moveDown ();
    } else {
      clearInterval (interval);
    }
  }, speed)
}

drop ();