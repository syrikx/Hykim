<template>
    <div>
        <br />
        답변 안된 질문들
        <ul>
            <li v-for="item in items" :key="item.id" @click="handleItemClick(item)">
                <div class="row">
                    <div class="item">{{ item.patient }}</div>
                    <div class="item">{{ item.question }}</div>
                    <div class="item">{{ formatLocalDate(item.date.created) }}</div>
                    <!-- <div class="item">{{ item.date.created }}</div> -->
                </div>
                <div v-if="selectedItem === item._id">
                    <input v-model="inputValue" @keyup.enter="handleInputEnter" placeholder="Enter value" />
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const items = ref([])
const selectedItem = ref(null)
const inputValue = ref('')

onMounted(async () => {
    try {
        const response = await axios.get('https://playfi.site/api/qna/unanswered') // Replace with your API endpoint
        items.value = response.data.articles
        console.log(items)
    } catch (error) {
        console.error(error)
    }
})

function formatLocalDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleString()
}

async function handleItemClick(item) {
    selectedItem.value = item._id
    console.log("item selected : ", selectedItem.value)
}

async function handleInputEnter() {
    try {
        const item = items.value.find((item) => item._id === selectedItem.value)
        const response = await axios.post('https://playfi.site/api/qna/makeanswer', { _id: item._id, answer: inputValue.value }) // Replace with your API endpoint and payload
        console.log(response.data)
        // Handle successful response
    } catch (error) {
        console.error(error)
        // Handle error
    }
}
</script>

<style scoped>
.row {
    display: flex;
    justify-content: space-between;
    padding: 10px;
}

.item {
    /* flex-basis: 33.33%; */
    flex-basis: 100%;
}
</style>
