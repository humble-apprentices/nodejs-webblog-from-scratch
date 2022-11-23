export const getCookies = (str) => {
  let res = {};
  if (!str) return res;
  const cookies = str.split(';');
  cookies.forEach(item => {
    const keyVal = item.split('=');
    res[keyVal[0].trim()] = keyVal[1].trim();
  })
  return res;
}

export const getCookie = (name, str) => {
  let val = ''
  if (!str) return val;
  const cookies = getCookies(str);
  return cookies[name] || '';
}