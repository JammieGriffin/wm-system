import { createApp } from "vue";
import "./scss/style.scss";
import naiveui from "naive-ui";
import App from "./App.vue";
import router from "./router/index";
import { pinia } from "./store";



const app = createApp(App);
app.use(pinia)
.use(naiveui)
.use(router);

app.mount("#app");
