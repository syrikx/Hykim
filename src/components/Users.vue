<template>
    <div>
        <button @click="fetchData">모든 제출자 확인</button>
        <table v-if="users.length">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id" @click="handleUserIdClicked(user.id)">
                    <td>{{ user.id }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.date }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import useGlobalState from '../state.js';
import axios from 'axios';

const { state, setInputValue } = useGlobalState();

const handleUserIdClicked = (id) => {
    console.log("clicked : ", id)
    setInputValue(id);
};

const users = ref([]);

async function fetchData() {
    try {
        const response = await axios.get("/api/getusers");
        users.value = response.data;
    } catch (error) {
        console.error(error);
    }
}
</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 1em;
    border: 1px solid #ddd;
}

th {
    background-color: #4CAF50;
    color: white;
}
</style>
