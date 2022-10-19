import { defineStore,createPinia } from "pinia";
import { IUsr } from "../api/data";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const useUsrstore = defineStore("usr", {
  state: () => {
    return {
      token: "" as string,
      usr: {} as IUsr,
      invalidLogin:false,
    };
  },
  persist: {
    storage: sessionStorage,
    paths: ['token','usr','isvalidLogin'],
  },
});
export {
  pinia,
  useUsrstore
}
