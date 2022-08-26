export interface ILoginModel {
  account: String | null;
  pwd: String | null;
  checkDeal: Boolean;
}
export interface IRegisterModel {
  account: String | null;
  pwd: String | null;
  repwd: String | null;
  email: String | null;
  captcha: String | null;
  checkDeal: Boolean;
}
export interface IRegisterPageCtrl {
  sendCode: Boolean;
}
