import { Component } from "vue";

export interface ILoginModel {
  account: String | null;
  pwd: String | null;
  checkDeal: Boolean;
}
export interface IRegisterModel {
  account: String | null;
  pwd: String | null;
  usrName: string | null;
  repwd: String | null;
  phone: String | null;
  sex: string | null;
}
export interface IRegisterPageCtrl {
  checkDeal: Boolean;
}
