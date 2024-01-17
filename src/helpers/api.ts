import axios from "axios";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const getFromCookies = (key: string) => {
  return Cookies.get("user")
    ? JSON.parse(Cookies.get("user") || "")[key]
    : null;
};

const commonAxios = axios.create();

const apiCall = async (
  endpoint: string,
  method = "GET",
  data: { email: string; password: string } | object = {},
  headers = {},
  retry = false
) => {
  const url = `${BASE_URL}/${endpoint}`;

  const token = getFromCookies("access_token");

  try {
    const response = await commonAxios({
      url,
      method,
      data,
      headers: {
        ...headers,
        Authorization: "Bearer " + token,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const refreshToken = async () => {
  const url = `${BASE_URL}/auth/refresh`;
  const token = getFromCookies("refresh_token");
  let newAccessToken = null;
  try {
    const response = await axios.post(url, {
      refresh_token: token,
    });
    newAccessToken = response.data.data.access_token;
    Cookies.set("user", JSON.stringify(response.data.data));
  } catch (error) {
    Cookies.remove("user");
    window.location.href = "/login";
    return;
  }

  return newAccessToken;
};

commonAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiCall;
