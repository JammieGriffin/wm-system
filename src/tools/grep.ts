const EMAIL_GREP = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/;

function checkEmail(email: string): boolean {
  return EMAIL_GREP.test(email);
}

export default {
  checkEmail,
};
