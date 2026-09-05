import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? "http://127.0.0.1:8000/api/"
    : "https://petcarehub-2.onrender.com/api/");
    
const api = axios.create({
  baseURL: API_BASE_URL,
});

/*
  Add the access token to every request
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


/*
  Handle expired access tokens
*/
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    /*
      Only try to refresh when:
      1. Server returned 401
      2. We have a request
      3. This request hasn't already been retried
    */
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      const refreshToken =
        localStorage.getItem("refresh");

      /*
        No refresh token.
        Just return the original error.
      */
      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
            const response = await axios.post(
            `${API_BASE_URL}token/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken =
          response.data.access;

        localStorage.setItem(
          "access",
          newAccessToken
        );

        /*
          Put the new token into
          the original failed request.
        */
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        /*
          Retry the original request.
        */
        return api(originalRequest);

      } catch (refreshError) {

        /*
          Refresh token is genuinely invalid.
          Now clear authentication.
        */
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;