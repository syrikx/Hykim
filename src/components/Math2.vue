<template>
    <div id="app">
        <div v-if="!gameStarted">
            <button @click="startGame">게임 시작</button>
        </div>
        <div class="game-board" v-if="gameStarted && !gameOver">
            <div class="problem-area">
                <div class="number-box">{{ firstNumber }}</div>
                <div class="number-box">{{ secondNumber }}</div>
                <div class="funnel">🔻</div>
                <div class="number-box">{{ selectedCard }}</div>
            </div>
            <div class="card-selection">
                <div v-for="card in cards" :key="card" @click="selectCard(card)" class="card">{{ card }}</div>
            </div>
        </div>
        <div class="results" v-if="gameStarted && !gameOver">
            <div>문제 번호: {{ correctAnswers + incorrectAnswers + 1 }}</div>
            <div><span :key="correctAnswers" class="animated-number">맞춘 문제 수: {{ correctAnswers }}</span></div>
            <div><span :key="incorrectAnswers" class="animated-number">틀린 문제 수: {{ incorrectAnswers }}</span></div>
            <div>남은 시간: {{ remainingTime }}</div>
        </div>
        <div v-if="gameOver" class="game-over-screen">
            <h2>게임 오버!</h2>
            <p>{{ userName }}님, {{ correctAnswers + incorrectAnswers }}개의 문제를 풀었습니다.</p>
            <button @click="restartGame">다시 풀기</button>
        </div>
        <div v-if="pastResults.length > 0" class="past-results">
            <h2>과거 결과:</h2>
            <ul>
                <li v-for="(result, index) in pastResults" :key="index">
                    {{ result.date }}: 맞춘 문제 수 = {{ result.correct }}, 틀린 문제 수 = {{ result.wrong }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const gameStarted = ref(false);
const gameOver = ref(false);
const remainingTime = ref(0);
const cards = ref([]);
const firstNumber = ref(0);
const secondNumber = ref(0);
const selectedCard = ref('?');
const correctAnswers = ref(0);
const incorrectAnswers = ref(0);
const userName = ref('김시원');
const pastResults = ref([]);

let timer = null;

const startGame = () => {
    gameStarted.value = true;
    gameOver.value = false;
    correctAnswers.value = 0;
    incorrectAnswers.value = 0;
    remainingTime.value = 120; // 2분 타이머
    timer = setInterval(() => {
        if (remainingTime.value > 0) {
            remainingTime.value--;
        } else {
            clearInterval(timer);
            gameOver.value = true;
        }
    }, 1000);
    nextQuestion();
    pastResults.value = JSON.parse(localStorage.getItem("gameResults")) || [];
};

const generateCards = () => {
    const correctAnswer = firstNumber.value + secondNumber.value;
    cards.value = [correctAnswer];
    while (cards.value.length < 4) {
        const offset = Math.floor(Math.random() * 4) - 2; // -2, -1, 0, 1, 2 중 하나
        const option = correctAnswer + offset;
        if (option > 0 && option <= 9 && !cards.value.includes(option)) {
            cards.value.push(option);
        }
    }
    cards.value = cards.value.sort(() => Math.random() - 0.5); // 카드 순서 무작위로 섞기
};

const nextQuestion = () => {
    firstNumber.value = Math.floor(Math.random() * 9) + 1;
    secondNumber.value = Math.floor(Math.random() * 9) + 1;
    generateCards();
    selectedCard.value = '?';
};

const selectCard = (card) => {
    selectedCard.value = card;
    checkAnswer();
};

const checkAnswer = () => {
    if (selectedCard.value === firstNumber.value + secondNumber.value) {
        correctAnswers.value++;
    } else {
        incorrectAnswers.value++;
    }
    nextQuestion();
};

const restartGame = () => {
    gameStarted.value = false;
    gameOver.value = false;
    correctAnswers.value = 0;
    incorrectAnswers.value = 0;
    selectedCard.value = '?';
    pastResults.value = [];
};

watch(gameOver, (newValue) => {
    if (newValue) {
        clearInterval(timer);
        const result = {
            date: new Date().toLocaleString(),
            correct: correctAnswers.value,
            wrong: incorrectAnswers.value,
        };
        pastResults.value.push(result);
        localStorage.setItem("gameResults", JSON.stringify(pastResults.value));
    }
});
</script>

<style scoped>
.game-board, .options {
    display: flex;
    justify-content: center;
    margin-top: 30px;
    margin-bottom: 30px;
    flex-direction: row;
}

.problem-area {
    display: flex;
    align-items: center;
    margin-right: 20px;
}

.number-box {
    width: 100px;
    text-align: center;
    border: 1px solid #FF;
    color: blue;
    margin: 0 10px;
    font-size: 5em;
}

.card-selection {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.card {
    width: 80px;
    height: 120px;
    border: 1px solid #999;
    margin: 10px 0;
    text-align: center;
    line-height: 120px;
    font-size: 3em;
    cursor: pointer;
}

.funnel {
    font-size: 3em;
}

.results {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    flex-direction: column;
    text-align: center;
    font-size: 18px;
}

.game-over-screen {
    text-align: center;
    margin-top: 50px;
}

.game-over-screen h2 {
    font-size: 3em;
    color: red;
}

.game-over-screen p {
    font-size: 1.5em;
    margin: 20px 0;
}

.game-over-screen button {
    padding: 10px 20px;
    font-size: 1.2em;
    cursor: pointer;
}

.past-results ul {
    list-style: none;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
        color: aliceblue;
    }
    50% {
        opacity: 0.5;
        color: red;
    }
}

.animated-number {
    animation: pulse 2s;
}
</style>
