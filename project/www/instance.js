const config = {
  timeout: 20000,
  headers: {
    ["Cache-Control"]: "no-cache",
    ["Content-Type"]: "application/json",
    ["x-requested-with"]: "XMLHttpRequest",
  },
  validateStatus() {
    return true;
  },
  responseType: "json",
};
const axiosInstance = window.axios.create(config);

// 返回体拦截器，可以在这里对返回体做通用的验证、处理
axiosInstance.interceptors.response.use(
  (res) => {
    if (res.status === 401) {
      return (window.location.href = "./login.html");
    } else if (res.data.code !== 0) {
      window.Vue.prototype.$message.error(res.data.message);
      return Promise.reject(new Error(res.data.message || "请求失败"));
    }
    return res;
  },
  (error) => {
    return Promise.reject(error);
  }
);
