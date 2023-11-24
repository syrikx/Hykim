<template>
    <div id="app">
        <div v-if="!gameStarted">
            <input type="text" v-model="userName" placeholder="사용자 이름 입력">
            <input type="number" v-model.number="targetNumber" min="3">
            <button @click="startGame">게임 시작</button>
        </div>
        <div class="game-board" v-else>
            <div class="number-box">{{ givenNumber }}</div>
            <div class="operator-box">+</div>
            <div class="number-box">{{ selectedNumber }}</div>
            <div class="operator-box">=</div>
            <div class="number-box">{{ targetNumber }}</div>
        </div>
        <div class="options" v-if="gameStarted">
            <div v-for="option in options" :key="option" @click="selectOption(option)" class="number-box2">{{ option }}</div>
        </div>
        <div class="results" v-if="gameStarted">
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

// 사용자 이름을 localStorage에서 가져옵니다.
onMounted(() => {
    userName.value = localStorage.getItem('userName') || '';
});

const startGame = () => {
    gameStarted.value = true;
    remainingTime.value = 120; // 초시계 시간 설정
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

    // 사용자 이름을 localStorage에 저장합니다.
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
        nextQuestion();
    } else {
        incorrectAnswers.value++;
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
.game-board,
.options {
    display: flex;
    justify-content: center;
    margin-top: 30px;
    margin-bottom: 30px;
    flex-direction: row;
}

.results {
    display: flex;
    justify-content: c;
    margin-bottom: 20px;
    flex-direction: column;
    text-align: center;
    font-size: 18px;
}

.number-box {
    width: 100px;
    text-align: center;
    border: 1px solid #FF;
    color: blue;
    margin: 0 10px;
    font-size: 5em;
}

.number-box2 {
    width: 100px;
    text-align: center;
    border: 1px solid #999;
    color: blue;
    margin: 0 20px;
    font-size: 5em;
}

.operator-box {
    width: 100px;
    text-align: center;
    border: 1px solid #FFF;
    color: blue;
    margin: 0 10px;
    font-size: 5em;
}

.animated-number {
    animation: pulse 2s;
}

.past-results {
    width: 100%;
    margin-top: 30px;
}

.past-results ul {
    list-style: none;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
        color: aliceblue;
    }

    50% {
        opacity: 0.5;
        color: red;
    }
}
</style>
