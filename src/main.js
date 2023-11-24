import { createApp } from "vue";
import App from "./App.vue";
import Snake from "./components/Snake.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);
app.use(router);
app.mount("#app");

// const app = createApp(Snake);
// app.use(router);
// app.mount("#app");
