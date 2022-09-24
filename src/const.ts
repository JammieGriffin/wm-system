import axios from "axios";
import { useUsrstore } from "./store";
import router from "./router";
const store = useUsrstore();
const axiosConf = {
  baseURL: "http://localhost:8188",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
};
const baseAxios = axios.create(axiosConf);

baseAxios.interceptors.request.use((conf) => {
  if (conf.url !== "/sys/login") {
    conf.headers!.usrToken = store.$state.token;
  }
  return conf;
});
baseAxios.interceptors.response.use((conf) => {
  
  return conf;
},
(err) => {
  if (err.response.status === 401) {
    router.push({path:"/login"})
  }
  return Promise.reject(err.response.data)
})
export { baseAxios };
