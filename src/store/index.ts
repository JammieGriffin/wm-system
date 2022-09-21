import { defineStore } from "pinia";
import { IUsr } from "../api/data";

export const useUsrstore = defineStore("usr", {
  state: () => {
    return {
      token: "" as string,
      usr: {} as IUsr,
    };
  },
});
