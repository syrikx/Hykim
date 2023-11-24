<template>
  <div>
    <p>결과 레포트를 보기 위해 아래에 환자번호(7자리 숫자)를 입력하고 조회하세요</p>
    <input v-model="inputValue" @keyup.enter="fetchData" />
    <button @click="fetchData">조회하기</button>
    <div v-if="userData">
      <h2>사용자 정보</h2>
      <table>
        <tr>
          <th>ID</th>
          <th>이름</th>
          <th>생년월일</th>
        </tr>
        <tr>
          <td>{{ userData.id }}</td>
          <td>{{ userData.name }}</td>
          <td>{{ userData.birthday }}</td>
        </tr>
      </table>

      <h2>사용자 데이터</h2>
      <table>
        <tr>
          <th>날짜</th>
          <th>아트로핀</th>
          <th>근거리활동</th>
          <th>야외활동</th>
        </tr>
        <tr class="center" v-for="date in uniqueDates" :key="date">
          <td>{{ date }}</td>
          <td>{{ userData.didDropAtropine[date] ? 'O' : 'X' }}</td>
          <td>{{ userData.timeSpentOnNearbyTasks[date] }}</td>
          <td>{{ userData.timeSpentOutdoors[date] }}</td>
        </tr>
      </table>

    </div>

    <div :key="keyImage" v-if="resultValue !== null">
      <div v-if="resultValue.file">
        <img :src="imageSrc" width="640" />
      </div>
      <div>
        Result: {{ resultValue.result }}
      </div>
    </div>
    <p>결과 레포트를 업로드 하기 위해 아래에 파일을 드랍하세요. 그 전에 반드시 환자번호를 확인하세요. 경고 없이 덮어쓰기 됩니다.</p>
    <div>
      <div class="drop-area" @dragover.prevent @drop="handleFileDrop" @click="$refs.fileInput.click()">
        <p>Drag and drop a file here, or click to select a file.</p>
        <input type="file" ref="fileInput" style="display: none;" @change="handleFileSelect" />
      </div>
    </div>
  </div>
  <Unanswered />
</template>

<script setup>
import { ref, computed } from 'vue';
import useGlobalState from '../state.js';
import axios from 'axios';
import Unanswered from './Unanswered.vue'

const { state, setInputValue } = useGlobalState();

const inputValue = computed({
  get: () => state.inputValue,
  set: (value) => setInputValue(value),
});

const userData = ref(null);
// const inputValue = ref('');
const imageSrc = ref('');
const keyImage = ref(0);
const resultValue = ref(null);
const fileList = ref(null);
const reader = new FileReader()

const uniqueDates = computed(() => {
  if (!userData.value) return [];
  const allDates = [
    ...Object.keys(userData.value.didDropAtropine || {}),
    ...Object.keys(userData.value.timeSpentOnNearbyTasks || {}),
    ...Object.keys(userData.value.timeSpentOutdoors || {}),
  ];
  return [...new Set(allDates)].sort();
});

async function fetchData() {
  resultValue.value = null
  imageSrc.value = ''
  keyImage.value++

  try {
    userData.value = await fetchUser();
  } catch (error) {
    console.error(error);
    // handle error
  }

  try {
    const response = await axios.get(`/api/getResult/00${inputValue.value}`, {
      // params: {
      //   value: inputValue.value,
      // },
    });
    resultValue.value = response.data
    imageSrc.value = `/api/getfile/${resultValue.value.file}?${Date.now()}`
    console.log(response.data)
    console.log("resultValue", resultValue.value)
    // const img = document.querySelector('img');
    // img.src = img.src + '?' + Date.now();
  } catch (error) {
    console.error(error);
    // handle error
  }
}

async function fetchUser() {
  try {
    const response = await axios.get(`/api/getUser/00/${inputValue.value}`);
    return response.data;
  } catch (error) {
    console.error(error);
    // handle error
  }
}


function handleFileSelect(event) {
  const files = event.target.files;
  const file = files[0];
  // file.fieldname = inputValue.value
  console.log('handleFileSelect :', file)
  uploadFile(file);
}

function handleFileDrop(event) {
  event.preventDefault();
  const files = event.dataTransfer.files;
  const file = files[0];
  console.log('handleFileDrop :', file)
  // const file = reader.readAsDataURL(files[0])

  uploadFile(file);
  // addFiles(file)
}

function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file, "00" + inputValue.value + ".png");
  axios.post('/api/postfile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(response => {
    console.log(response);
    if (response.status == 200) {
      fetchData()
    }
    // handle success
  }).catch(error => {
    console.error(error);
    // handle error
  });
  const hospitalCode = '00'
  const id = inputValue.value
  axios.post('/api/verify', { hospitalCode, id })
    .then(response => {
      // 요청이 성공했을 때 처리할 로직
      console.log(response.data)
    })
    .catch(error => {
      // 요청이 실패했을 때 처리할 로직
      console.error(error)
    })
}

</script>

<style scoped>
.center {
  text-align: center;
}

.drop-area {
  width: 200px;
  height: 200px;
  border: 2px dashed gray;
  display: flex;
  justify-content: center;
  align-items: center;
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th,
table td {
  border: 1px solid #ddd;
  padding: 4px;
  text-align: center;
}

table tr:nth-child(even) {
  background-color: #400ff1ab;
}

table tr:nth-child(odd) {
  background-color: #20facb60;
}

table th {
  background-color: #20facb60;
  color: white;
}


@media (min-width: 1024px) {

  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
