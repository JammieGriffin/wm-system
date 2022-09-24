import { defineStore,createPinia } from "pinia";
import { IUsr } from "../api/data";
export const pinia = createPinia();
export const useUsrstore = defineStore("usr", {
  state: () => {
    return {
      token: "" as string,
      usr: {} as IUsr,
      invalidLogin:false,
    };
  },
});
