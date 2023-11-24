<template>
    <canvas ref="canvas" width="800" height="800"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const canvas = ref(null);
const router = useRouter();

onMounted(() => {
    const ctx = canvas.value.getContext('2d');

    const CANVAS_WIDTH = canvas.value.width;
    const CANVAS_HEIGHT = canvas.value.height;
    const CELL_SIZE = 20;
    const GRID_WIDTH = CANVAS_WIDTH / CELL_SIZE;
    const GRID_HEIGHT = CANVAS_HEIGHT / CELL_SIZE;

    let snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
    ];
    let dx = 1;
    let dy = 0;
    let food = {};
    let score = 0;

    function init() {
        spawnFood();
    }

    function resetGame() {
        snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 },
        ];
        dx = 1;
        dy = 0;
        spawnFood();
        score = 0;
    }

    function spawnFood() {
        food = {
            x: Math.floor(Math.random() * GRID_WIDTH),
            y: Math.floor(Math.random() * GRID_HEIGHT),
        };
    }

    function drawSnake() {
        ctx.fillStyle = 'green';
        snake.forEach((cell) => {
            ctx.fillRect(
                cell.x * CELL_SIZE,
                cell.y * CELL_SIZE,
                CELL_SIZE,
                CELL_SIZE
            );
        });
    }

    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score++;
            spawnFood();
        } else {
            snake.pop();
        }
        if (
            head.x < 0 ||
            head.x >= GRID_WIDTH ||
            head.y < 0 ||
            head.y >= GRID_HEIGHT ||
            snake.slice(1).some((cell) => cell.x === head.x && cell.y === head.y)
        ) {
            endGame();
        }
    }

    function drawFood() {
        ctx.fillStyle = 'red';
        ctx.fillRect(
            food.x * CELL_SIZE,
            food.y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        );
    }

    function drawScore() {
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText(`Score: ${score}`, 10, 20);
    }

    function endGame() {
        const playAgain = confirm(
            `Game over! Your score is ${score}. Play again?`
        );
        if (playAgain) {
            resetGame();
        } else {
            router.back();
        }
    }

    function gameLoop() {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        drawSnake();
        moveSnake();
        drawFood();
        drawScore();
        setTimeout(gameLoop, 100);
    }

    function handleKeyDown(event) {
        switch (event.code) {
            case 'ArrowLeft':
                if (dx === 0) {
                    dx = -1;
                }
                dy = 0;
                break;
            case 'ArrowUp':
                dx = 0;
                if (dy === 0) {
                    dy = -1;
                }
                break;
            case 'ArrowRight':
                if (dx === 0) {
                    dx = 1;
                }
                dy = 0;
                break;
            case 'ArrowDown':
                dx = 0;
                if (dy === 0) {
                    dy = 1;
                }
                break;
            default:
                break;
        }
    }

    document.addEventListener('keydown', handleKeyDown);

    init();
    gameLoop();

    onUnmounted(() => {
        document.removeEventListener('keydown', handleKeyDown);
    });
});
</script>

<style>
.snake-container {

    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: #f5f5f5;
}

canvas {
    border: 1px solid black;
    background-color: #f5f5f5;
}

.score {
    font-size: 24px;
    font-weight: bold;
    margin-top: 10px;
}

button {
    margin-top: 10px;
    font-size: 16px;
}
</style>


