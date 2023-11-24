<!-- src/components/WebSocketComponent.vue -->
<template>
    <div>
        <h2>WebSocket Demo</h2>
        <p>Received message: {{ receivedMessage }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const receivedMessage = ref('');
let socket;

onMounted(() => {
    initWebSocket();
});

function initWebSocket() {
    socket = new WebSocket('wss://playfi.site:8020');

    socket.addEventListener('open', () => {
        socket.send('hello');
    });

    socket.addEventListener('message', (event) => {
        receivedMessage.value = event.data;
    });

    socket.addEventListener('error', (event) => {
        console.error('WebSocket error:', event);
    });

    socket.addEventListener('close', (event) => {
        console.log('WebSocket closed:', event);
    });
}
</script>
