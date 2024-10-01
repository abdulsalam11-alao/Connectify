export const validateEmail = (email: string) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return true;
  }
  return false;
};

export const validatePassword = (password: string) => {
  const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (!passwordPattern.test(password)) {
    return true;
  }
  return false;
};

export const validateName = (name: string) => {
  if (!name.trim()) {
    return false;
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return true;
  }
  return true;
};
