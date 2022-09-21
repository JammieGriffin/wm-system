import { createApp } from "vue";
import "./scss/style.scss";
import naiveui from "naive-ui";
import App from "./App.vue";
import router from "./router/index";
import { createPinia } from "pinia";

const pinia = createPinia();
const app = createApp(App);
app.use(naiveui);
app.use(router);
app.use(pinia);
app.mount("#app");
