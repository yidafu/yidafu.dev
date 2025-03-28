
function dot(m1, m2) {
  return m1[0] * m2[0] + m1[1] * m2[1]
}
function getDirection(direction) {
  direction = direction & 3
  let vector = [0, 0]
  switch (direction) {
    case 0: {
      vector = [1, 1]
      break;
    }

    case 1: {
      vector = [-1, 1]
      break;
    }

    case 2: {
      vector = [-1, -1]
      break;
    }

    case 3: {
      vector = [1, -1]
      break;
    }
  }
  return vector
}
const CELL_SIZE = 100;

function noiseV1(x, y, matrix) {
  const X = 0;
  const Y = 0;
  const X_f = x
  const Y_f = y;

  const topRight = [X_f - 1.0, Y_f - 1.0]
  const topLeft = [X_f, Y_f - 1.0]
  const bottomRight = [X_f - 1.0, Y_f]
  const bottomLeft = [X_f, Y_f]


  const valueTopRight = matrix[X + 1][Y + 1]
  const valueTopLeft = matrix[X][Y + 1]
  const valueBottomRight = matrix[X + 1][Y]
  const valueBottomLeft = matrix[X][Y]

  const dotTopRight = dot(topRight, getDirection(valueTopRight))
  const dotTopLeft = dot(topLeft, getDirection(valueTopLeft))
  const dotBottomRight = dot(bottomRight, getDirection(valueBottomRight))
  const dotBottomLeft = dot(bottomLeft, getDirection(valueBottomLeft))

  return ((dotTopRight + dotBottomRight) + (dotTopLeft + dotBottomLeft))
}
const canvas = getCellRoot('800px', '800px').appendChild(document.createElement('canvas'))
canvas.width = 800
canvas.height = 800

/**
 * @type {CanvasRenderingContext2D}
 */
let ctx = canvas.getContext('2d');
/**
 * @param {number} x
 * @param {number} y
 * @param {[[number,number], [number, number]]} directions
 */
function renderGridCell(x, y, directions) {
  const gaps = [0, 0.2, 0.4, 0.6, 0.8];
  for (let i = 0; i < gaps.length; i++) {
    for (let j = 0; j < gaps.length; j++) {
      const m = gaps[i]
      const n = gaps[j]

      const value = noiseV1(m, n, directions) + 5;
      const text = parseFloat(value.toFixed(1), 10)
      const rgb = text / 10 * 255 | 0
      ctx.fillStyle = `rgb(${rgb}, ${rgb}, ${rgb})`
      ctx.fillRect(x + m * CELL_SIZE, y + n * CELL_SIZE, CELL_SIZE / 5, CELL_SIZE / 5)
      // ctx.strokeText(text, x + m * CELL_SIZE, y + n * CELL_SIZE)
    }
  }

  ctx.strokeStyle = 'blue'
  ctx.fillStyle = 'blue'
  directions.forEach((row, i) => {
    row.forEach((direction, j) => {
      const vector = getDirection(direction)
      ctx.beginPath();
      const end = [
        x + i * CELL_SIZE + vector[0] * CELL_SIZE / 4,
        y + j * CELL_SIZE + vector[1] * CELL_SIZE / 4,
      ]
      ctx.moveTo(x + i * CELL_SIZE, y + j * CELL_SIZE);
      ctx.lineTo(end[0], end[1]);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(end[0], end[1], CELL_SIZE / 20, 0, 2 * Math.PI)
      ctx.closePath()
      ctx.fill();
    })
  })

  ctx.strokeStyle = 'red'
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + CELL_SIZE, y)
  ctx.lineTo(x + CELL_SIZE, y + CELL_SIZE)
  ctx.lineTo(x, y + CELL_SIZE)
  ctx.closePath()
  ctx.stroke();
}
let count = 0;
for (let i = 0; i < 2; i++) {
  for (let j = 0; j < 2; j++) {
    for (let n = 0; n < 2; n++) {
      for (let m = 0; m < 2; m++) {
        const row = count / 4 | 0;
        const col = count % 4;
        count++;
        console.log([i, j,], [n, m])
        renderGridCell(50 + 200 * row, 50 + 200 * col, [[n, m], [i, j,]])
      }
    }
  }
}