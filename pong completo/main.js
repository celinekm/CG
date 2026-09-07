"use strict";

const canvas = document.querySelector("#canvas");
const gl = canvas.getContext("webgl");

const score1El = document.querySelector("#score1");
const score2El = document.querySelector("#score2");

if (!gl) {
  alert("WebGL não suportado!");
}

const vsSource = `
  attribute vec2 a_position;
  uniform mat3 u_matrix;
  void main() {
    gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
  }
`;

const fsSource = `
  precision mediump float;
  uniform vec4 u_color;
  void main() {
    gl_FragColor = u_color;
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

const program = gl.createProgram();
gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vsSource));
gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fsSource));
gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, "a_position");
const matrixLocation = gl.getUniformLocation(program, "u_matrix");
const colorLocation = gl.getUniformLocation(program, "u_color");

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
  gl.STATIC_DRAW
);

function getProjectionMatrix(width, height, x, y, scaleX, scaleY) {
  return [
    (2 / width) * scaleX, 0, 0,
    0, (-2 / height) * scaleY, 0,
    -1 + (2 * x) / width, 1 - (2 * y) / height, 1
  ];
}

const paddleW = 15, paddleH = 80;
const speed = 6;

const player1 = { x: 20, y: 260, score: 0 };
const player2 = { x: 565, y: 260, score: 0 };
const ball = { x: 290, y: 290, size: 15, vx: 4, vy: 3 };

const keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

function resetBall(direction) {
  ball.x = 290;
  ball.y = 290;
  ball.vx = direction * 4;
  ball.vy = (Math.random() - 0.5) * 6;
}

function update() {
 
  if (keys["w"] || keys["W"]) player1.y -= speed;
  if (keys["s"] || keys["S"]) player1.y += speed;
  player1.y = Math.max(0, Math.min(600 - paddleH, player1.y));

  if (keys["ArrowUp"]) player2.y -= speed;
  if (keys["ArrowDown"]) player2.y += speed;
  player2.y = Math.max(0, Math.min(600 - paddleH, player2.y));

  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.y <= 0 || ball.y + ball.size >= 600) ball.vy *= -1;

  if (
    ball.x < player1.x + paddleW &&
    ball.x + ball.size > player1.x &&
    ball.y < player1.y + paddleH &&
    ball.y + ball.size > player1.y
  ) {
    ball.vx = Math.abs(ball.vx) * 1.05;
    ball.x = player1.x + paddleW;
  }

  if (
    ball.x < player2.x + paddleW &&
    ball.x + ball.size > player2.x &&
    ball.y < player2.y + paddleH &&
    ball.y + ball.size > player2.y
  ) {
    ball.vx = -Math.abs(ball.vx) * 1.05;
    ball.x = player2.x - ball.size;
  }

  if (ball.x < 0) {
    player2.score++;
    score2El.textContent = player2.score;
    resetBall(1);
  }

  if (ball.x > 600) {
    player1.score++;
    score1El.textContent = player1.score;
    resetBall(-1);
  }
}

function drawRect(x, y, width, height, color) {
  const matrix = getProjectionMatrix(600, 600, x, y, width, height);
  gl.uniformMatrix3fv(matrixLocation, false, matrix);
  gl.uniform4fv(colorLocation, color);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function render() {
  gl.viewport(0, 0, 600, 600);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  for (let y = 10; y < 600; y += 30) {
    drawRect(297, y, 6, 15, [0.3, 0.3, 0.3, 1]);
  }

  drawRect(player1.x, player1.y, paddleW, paddleH, [0, 1, 0, 1]);

  drawRect(player2.x, player2.y, paddleW, paddleH, [0, 0.5, 1, 1]);

  drawRect(ball.x, ball.y, ball.size, ball.size, [1, 1, 1, 1]);
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

gameLoop();
