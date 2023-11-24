<template>
    <canvas ref="canvas" :width="canvasSize" :height="canvasSize"></canvas>
    <div v-if="toastMessage" class="toast">{{ toastMessage }}</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const canvas = ref(null);
const router = useRouter();

const canvasSize = computed(() => {
    return window.innerWidth < 800 ? window.innerWidth - 100 : 800;
});

onMounted(() => {
    const ctx = canvas.value.getContext('2d');

    const CANVAS_WIDTH = canvas.value.width;
    const CANVAS_HEIGHT = canvas.value.height;
    const CELL_SIZE = 10;
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
    const rect = canvas.value.getBoundingClientRect();

    function init() {
        spawnFood();
        const rect = canvas.value.getBoundingClientRect();
        console.log(`Left: ${rect.left}, Right: ${rect.right}, Top: ${rect.top}, Bottom: ${rect.bottom}`);
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
                moveTo('Left');
                break;
            case 'ArrowUp':
                moveTo('Up');
                break;
            case 'ArrowRight':
                moveTo('Right');
                break;
            case 'ArrowDown':
                moveTo('Down');
                break;
            default:
                break;
        }
    }

    function moveTo(direction) {
        showToast(`move to ${direction}`);
        switch (direction) {
            case 'Left':
                if (dx === 0) {
                    dx = -1;
                }
                dy = 0;
                break;
            case 'Up':
                dx = 0;
                if (dy === 0) {
                    dy = -1;
                }
                break;
            case 'Right':
                if (dx === 0) {
                    dx = 1;
                }
                dy = 0;
                break;
            case 'Down':
                dx = 0;
                if (dy === 0) {
                    dy = 1;
                }
                break;
            default:
                break;
        }
    }

    function onCanvasTouch(event) {
        const touch = event.touches[0];
        const touchX = Math.floor(touch.clientX);
        const touchY = Math.floor(touch.clientY);

        const centerX = Math.floor((rect.left + rect.right) / 2);
        const centerY = Math.floor((rect.top + rect.bottom) / 2);
        const XminusCenter = touchX - centerX;
        const YminusCenter = touchY - centerY;
        // showToast(`터치 좌표: (${touchX}, ${touchY}), dx: ${dx}, dy: ${dy}`);
        // showToast(`${touchX},${touchY},${dx},${dy}`);

        if (dx == 0) {
            if (XminusCenter > 0) {
                moveTo('Right');
            } else {
                moveTo('Left');
            }
        } else {
            if (YminusCenter > 0) {
                moveTo('Down');
            } else {
                moveTo('Up');
            }
        }
    }

    function changeDirection(newDx, newDy) {
        if (dx === 0) {
            dx = newDx;
        }
        dy = newDy;
    }

    document.addEventListener('keydown', handleKeyDown);
    canvas.value.addEventListener('touchstart', onCanvasTouch);

    init();
    gameLoop();

    onUnmounted(() => {
        document.removeEventListener('keydown', handleKeyDown);
        canvas.value.removeEventListener('touchstart', onCanvasTouch);
    });
});
// Toast
const toastMessage = ref(null);

function showToast(message) {
    toastMessage.value = message;
    setTimeout(() => {
        toastMessage.value = null;
    }, 3000);
}
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

.toast {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 14px;
}
</style>


