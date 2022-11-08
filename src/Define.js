export const checkExistsSpecailChar = (string) => {
  const format = /^[a-zA-Z0-9]*$/;
  return format.test(string);
};

export const MAX_MEMBER = 12
