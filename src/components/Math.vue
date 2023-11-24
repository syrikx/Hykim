<template>
    <div id="app">
        <div v-if="!gameStarted">
            <input type="text" v-model="userName" placeholder="사용자 이름 입력">
            <input type="number" v-model.number="targetNumber" min="3">
            <button @click="startGame">게임 시작</button>
        </div>
        <div class="game-board" v-if="gameStarted && !gameOver">
            <div class="number-box">{{ givenNumber }}</div>
            <div class="operator-box">+</div>
            <div class="number-box">{{ selectedNumber }}</div>
            <div class="operator-box">=</div>
            <div class="number-box">{{ targetNumber }}</div>
            <div class="options">
                <div v-for="option in options" :key="option" @click="selectOption(option)" class="number-box2">{{ option }}</div>
            </div>
            <div class="feedback-overlay">
                <div class="circle" :style="circleStyle"></div>
                <div class="cross" :style="crossStyle">X</div>
            </div>
        </div>
        <div class="results" v-if="gameStarted && !gameOver">
            <div>문제 번호: {{ correctAnswers + incorrectAnswers + 1 }}</div>
            <div><span :key="correctAnswers" class="animated-number">맞춘 문제 수: {{ correctAnswers }}</span></div>
            <div><span :key="incorrectAnswers" class="animated-number">틀린 문제 수: {{ incorrectAnswers }}</span></div>
            <div>남은 시간: {{ remainingTime }}</div>
        </div>
        <div v-if="gameOver" class="game-over">
            <h2>게임 오버!</h2>
            <p>{{ userName }}님, {{ correctAnswers + incorrectAnswers }}개의 문제를 풀었습니다.</p>
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
import { ref, computed, watch, onMounted } from 'vue';

let targetNumber = ref(5);
const givenNumber = ref(0);
const options = ref([]);
const gameStarted = ref(false);
const remainingTime = ref(0);
let timer = null;
let selectedNumber = ref('?');
let userName = ref('');
let correctAnswers = ref(0);
let incorrectAnswers = ref(0);
let gameOver = ref(false);
let pastResults = ref([]);
let previousGivenNumber = ref(null);

onMounted(() => {
    userName.value = localStorage.getItem('userName') || '';
});

const circleStyle = ref({ opacity: 0 });
const crossStyle = ref({ opacity: 0 });

const startGame = () => {
    gameStarted.value = true;
    remainingTime.value = 120;
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
    localStorage.setItem('userName', userName.value);
};

const nextQuestion = () => {
    let newGivenNumber;
    do {
        newGivenNumber = Math.floor(Math.random() * (targetNumber.value - 1) + 1);
    } while (newGivenNumber === previousGivenNumber.value);
    givenNumber.value = newGivenNumber;
    previousGivenNumber.value = newGivenNumber;

    options.value = [targetNumber.value - givenNumber.value];
    while (options.value.length < 3) {
        const option = Math.floor(Math.random() * targetNumber.value);
        if (!options.value.includes(option)) {
            options.value.push(option);
        }
    }
    options.value.sort(() => Math.random() - 0.5);
    selectedNumber.value = '?';
};

const selectOption = (option) => {
    selectedNumber.value = option;
    if (option === targetNumber.value - givenNumber.value) {
        correctAnswers.value++;
        circleStyle.value = { opacity: 0.3 };
        setTimeout(() => circleStyle.value = { opacity: 0 }, 500);
        nextQuestion();
    } else {
        incorrectAnswers.value++;
        crossStyle.value = { opacity: 0.3 };
        setTimeout(() => crossStyle.value = { opacity: 0 }, 500);
        selectedNumber.value = '?';
    }
};

watch(gameOver, (newValue) => {
    if (newValue) {
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

.results {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    flex-direction: column;
    text-align: center;
    font-size: 18px;
}

.number-box, .number-box2, .operator-box {
    width: 100px;
    text-align: center;
    border: 1px solid #FFF;
    color: blue;
    margin: 0 10px;
    font-size: 5em;
}

.feedback-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.circle {
    width: 70%;
    height: 70%;
    border-radius: 50%;
    background-color: green;
    position: absolute;
    opacity: 0;
}

.cross {
    font-size: 10em;
    color: red;
    position: absolute;
    opacity: 0;
}

.animated-number {
    animation: pulse 2s;
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
</style>
