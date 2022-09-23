import axios from "axios";
import { useUsrstore } from "./store";
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
baseAxios.interceptors.response.use(
  (response) => {
    return response.data;
  }
);
export { baseAxios };
