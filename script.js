// Obtén los elementos del DOM
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const startButton = document.getElementById("startButton");
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const speedRange = document.getElementById("speedRange");

// Definir variables para la serpiente y la comida
let snake = [
  { x: 200, y: 200 },
  { x: 190, y: 200 },
  { x: 180, y: 200 },
  { x: 170, y: 200 },
  { x: 160, y: 200 }
];
let food = { x: 0, y: 0 };

// Definir la dirección de la serpiente
let dx = 10;
let dy = 0;

// Variables de control del juego
let gameRunning = false;
let score = 0;
let intervalId;

// Función para dibujar un segmento de la serpiente
function drawSnakeSegment(segment) {
  context.fillStyle = "#00FF00";
  context.fillRect(segment.x, segment.y, 10, 10);
  context.strokeStyle = "#000";
  context.strokeRect(segment.x, segment.y, 10, 10);
}

// Función para dibujar la serpiente en el canvas
function drawSnake() {
  snake.forEach(drawSnakeSegment);
}

// Función para mover la serpiente
function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  // Verificar si la serpiente ha comido la comida
  const hasEatenFood = snake[0].x === food.x && snake[0].y === food.y;
  if (hasEatenFood) {
    // Generar nueva posición para la comida
    generateFoodPosition();
    score += 10;
    scoreElement.textContent = "Puntos: " + score;
  } else {
    // Si no ha comido, remover la última parte de la serpiente
    snake.pop();
  }
}

// Función para generar una nueva posición para la comida
function generateFoodPosition() {
  const maxX = canvas.width / 10;
  const maxY = canvas.height / 10;
  food.x = Math.floor(Math.random() * maxX) * 10;
  food.y = Math.floor(Math.random() * maxY) * 10;
}

// Función para dibujar la comida en el canvas
function drawFood() {
  context.fillStyle = "#FF0000";
  context.fillRect(food.x, food.y, 10, 10);
}

// Función para actualizar el juego en cada frame
function updateGame() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  moveSnake();
  drawSnake();
  drawFood();
  checkCollision();
}

// Función para manejar los eventos de teclado
function handleKeyDown(event) {
  const keyPressed = event.key;
  const isArrowUp = keyPressed === "ArrowUp";
  const isArrowDown = keyPressed === "ArrowDown";
  const isArrowLeft = keyPressed === "ArrowLeft";
  const isArrowRight = keyPressed === "ArrowRight";

  if (isArrowUp && dy !== 10) {
    dx = 0;
    dy = -10;
  } else if (isArrowDown && dy !== -10) {
    dx = 0;
    dy = 10;
  } else if (isArrowLeft && dx !== 10) {
    dx = -10;
    dy = 0;
  } else if (isArrowRight && dx !== -10) {
    dx = 10;
    dy = 0;
  }
}

// Función para comprobar si la serpiente choca consigo misma o con el borde
function checkCollision() {
  const head = snake[0];
  const isOutOfBounds =
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height;

  if (isOutOfBounds || checkSelfCollision()) {
    endGame();
    container.classList.add("collision"); // Agregar la clase "collision" al contenedor
  }
}

// Función para comprobar si la serpiente choca consigo misma
function checkSelfCollision() {
  const head = snake[0];
  return snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
}

// Función para ajustar la velocidad de la serpiente
function setSnakeSpeed() {
  const speed = parseInt(speedRange.value);
  clearInterval(intervalId);
  intervalId = setInterval(updateGame, 1000 / speed);
}

// Función para iniciar el juego
function startGame() {
  if (!gameRunning) {
    snake = [
      { x: 200, y: 200 },
      { x: 190, y: 200 },
      { x: 180, y: 200 },
      { x: 170, y: 200 },
      { x: 160, y: 200 }
    ];
    dx = 10;
    dy = 0;
    score = 0;
    scoreElement.textContent = "Puntos: " + score;
    generateFoodPosition();
    gameRunning = true;
    startButton.disabled = true;
    setSnakeSpeed();
    container.classList.remove("collision");
  }
}

// Función para finalizar el juego
function endGame() {
  gameRunning = false;
  startButton.disabled = false;
  clearInterval(intervalId);
}

// Evento clic para el botón de inicio
startButton.addEventListener("click", startGame);

// Evento de teclado para controlar la serpiente
document.addEventListener("keydown", handleKeyDown);

// Evento clic para el botón de control "Arriba"
upButton.addEventListener("click", function () {
  dx = 0;
  dy = -10;
});

// Evento clic para el botón de control "Abajo"
downButton.addEventListener("click", function () {
  dx = 0;
  dy = 10;
});

// Evento clic para el botón de control "Izquierda"
leftButton.addEventListener("click", function () {
  dx = -10;
  dy = 0;
});

// Evento clic para el botón de control "Derecha"
rightButton.addEventListener("click", function () {
  dx = 10;
  dy = 0;
});

// Evento cambio para el control de velocidad
speedRange.addEventListener("change", setSnakeSpeed);
