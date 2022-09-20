const EMAIL_GREP = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/;

function checkEmail(email: string): boolean {
  return EMAIL_GREP.test(email);
}

const PHONE_GREP = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;

function checkPhone(phone:string){
  return PHONE_GREP.test(phone);
}

export default {
  checkEmail,
  checkPhone
};
