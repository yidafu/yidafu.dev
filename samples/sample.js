const matrix = [
  [17, 182, 189, 28, 42, 223],
  [119, 248, 152, 2, 44, 154],
  [147, 118, 126, 255, 82, 85],
  [40, 244, 102, 143, 54, 65],
  [245, 40, 244, 102, 143, 54],
  [225, 140, 36, 103, 30, 69],
];

const gridSize = matrix.length;
/**
 * @type {HTMLCanvasElement}
 */
const canvas = getCellRoot('600px', '600px').appendChild(document.createElement('canvas'))
canvas.width = 600
canvas.height = 600
/**
 * @type {CanvasRenderingContext2D}
 */
let ctx = canvas.getContext('2d');

ctx.fillStyle = '#000';
const gridGap = 100;
const halfGap = gridGap / 2;
const qGap = gridGap / 4;

ctx.lineWidth = gridGap / 100;

ctx.font = "100px serif";
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


function Fade(t) {
  return 6 * t * t * t * t * t - 15 * t * t * t * t + 10 * t * t * t;;
}

function Lerp(t, a1, a2) {
  return a1 + t * (a2 - a1);
}

/****************************** 绘制样例点 ******************************/

function dot(m1, m2) {
  return m1[0] * m2[0] + m1[1] * m2[1]
}

function noise(x, y) {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;

  const X_f = x - Math.floor(x)
  const Y_f = y - Math.floor(y)

  const topRight = [X_f - 1.0, Y_f - 1.0]
  const topLeft = [X_f, Y_f - 1.0]
  const bottomRight = [X_f - 1.0, Y_f]
  const bottomLeft = [X_f, Y_f]

  const valueTopRight = matrix[X + 1][Y + 1]
  const valueTopLeft = matrix[X][Y + 1]
  const valueBottomRight = matrix[X + 1][Y]
  const valueBottomLeft = matrix[X][Y]

  // console.log(X, Y, valueTopRight, valueTopLeft, valueBottomRight, valueBottomLeft);

  const dotTopRight = dot(topRight, getDirection(valueTopRight))
  const dotTopLeft = dot(topLeft, getDirection(valueTopLeft))
  const dotBottomRight = dot(bottomRight, getDirection(valueBottomRight))
  const dotBottomLeft = dot(bottomLeft, getDirection(valueBottomLeft))

  let u = Fade(X_f);
  let v = Fade(Y_f);

  return Lerp(
    u,
    Lerp(v, dotBottomLeft, dotTopLeft),
    Lerp(v, dotBottomRight, dotTopRight)
  );
}

ctx.font = "16px serif";
for (let i = 0; i < 500; i += 1) {
  for (let j = 0; j < 500; j += 1) {
    const x = i * 0.005;
    const y = j * 0.005;
    let value = noise(x, y)
    value += 1.0;
    value *= 0.5;
    // console.log('value ==>', value)

    // console.log(value)
    // console.log(x * gridGap + halfGap, y * gridGap + halfGap)
    // const value = (dotTopLeft - dotBottomLeft) - (dotTopRight - dotBottomRight)
    const rgb = 255 - Math.round(255 * value);
    ctx.fillStyle = `rgb(${rgb}, ${rgb}, ${rgb})`
    ctx.fillRect(x * gridGap + halfGap, y * gridGap + halfGap, halfGap / 100, halfGap / 100)
    // ctx.strokeText(value.toFixed(2), x * gridGap + 50, y * gridGap + 50)
  }
}
/****************************** 绘制样例点 ******************************/


/****************************** 绘制网格 ******************************/


ctx.lineWidth = gridGap / 100;
for (let i = 0; i < gridSize; i++) {
  for (let j = 0; j < gridSize; j++) {
    const direction = matrix[i][j] & 3
    ctx.strokeText(direction, i * gridGap + 40, j * gridGap + 70)

    let vector = getDirection(direction)
    ctx.fillStyle = 'red'
    ctx.strokeStyle = 'red'
    ctx.beginPath();
    ctx.moveTo(i * gridGap + halfGap, j * gridGap + halfGap);
    ctx.lineTo(i * gridGap + halfGap + vector[0] * qGap, j * gridGap + halfGap + vector[1] * qGap);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(i * gridGap + halfGap + vector[0] * qGap, j * gridGap + halfGap + vector[1] * qGap, halfGap / 10, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  }
}


for (let i = 0; i <= gridSize; i++) {
  ctx.beginPath();
  ctx.moveTo(i * gridGap + halfGap, halfGap);
  ctx.lineTo(i * gridGap + halfGap, gridSize * gridGap + halfGap);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(halfGap, i * gridGap + halfGap);
  ctx.lineTo(gridSize * gridGap + halfGap, i * gridGap + halfGap);
  ctx.closePath();
  ctx.stroke();
}
/****************************** 绘制网格 ******************************/
