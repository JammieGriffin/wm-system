import axios from "axios";

const axiosConf = {
  baseURL: "http://localhost:8188",
  timeout: 5000,
  Headers: {
    "Content-Type": "application/json",
  },
};

export const baseAxios = axios.create(axiosConf);
