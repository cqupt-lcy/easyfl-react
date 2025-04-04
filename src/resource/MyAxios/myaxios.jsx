import axios from "axios";
import { notification } from "antd";

// 创建 axios 实例
const Myaxios = axios.create({
  baseURL: "http://10.16.53.208:8000", // 统一 API 地址
  timeout: 10000, // 超时时间
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
Myaxios.interceptors.request.use(
  (config) => {
    // 设置需要校验 data 的请求路径
    const needCheckDataEndpoints = ['/train']; // 根据你项目的接口名填写

    // 如果是需要校验 data 的请求才做检查
    if (
      needCheckDataEndpoints.includes(config.url) &&
      (!config.data || Object.keys(config.data).length === 0)
    ) {
      console.warn("请求被拦截: 发送的数据不能为空");
      alert("训练失败: 请完整输入所有参数");
      return Promise.reject(new Error("请求数据不能为空"));
    }

    console.log("请求发送:", config);
    return config;
  },
  (error) => {
    console.error("请求错误:", error);
    return Promise.reject(error);
  }
);


// 响应拦截器
Myaxios.interceptors.response.use(
  (response) => {
    console.log("响应数据:", response.data);

    // 检查是否包含错误码
    if (response.data.code && response.data.code !== 200) {
      notification.error({
        message: "请求错误",
        description: response.data.message || "服务器返回异常",
      });
      return Promise.reject(response.data);
    }

    return response.data;
  },
  (error) => {
    console.error("响应错误:", error);

    let message = "请检查您的网络连接";
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          message = data.message || "请求参数错误";
          break;
        case 401:
          message = "未授权，请重新登录";
          // 这里可以触发登出逻辑，比如清除 token 并跳转到登录页
          break;
        case 403:
          message = "权限不足，无法执行此操作";
          break;
        case 404:
          message = "请求的资源不存在";
          break;
        case 500:
          message = "服务器异常，请稍后再试";
          break;
        default:
          message = data.message || `请求错误，状态码: ${status}`;
      }
    } else if (error.code === "ECONNABORTED") {
      message = "请求超时，请检查网络";
    }

    // 显示错误提示
    notification.error({
      message: "网络错误",
      description: message,
    });

    return Promise.reject(error);
  }
);


// 封装通用请求方法
const request = {
  get: (url, params, config = {}) => Myaxios.get(url, { params, ...config }),
  post: (url, data, config = {}) => Myaxios.post(url, data, config),
  put: (url, data, config = {}) => Myaxios.put(url, data, config),
  delete: (url, config = {}) => Myaxios.delete(url, config),
};

export {request,Myaxios}
