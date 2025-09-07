export const emailValid = (email) => {
  // Must match: at least 3 chars, @, at least 3 chars, ., at least 3 chars
  const regExp = /^[\w.-]{3,}@[a-zA-Z\d.-]{3,}\.[a-zA-Z]{3,}$/
  return regExp.test(email)
}
