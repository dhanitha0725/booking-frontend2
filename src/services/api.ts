import axios from "axios";

const TOKEN_KEY = "authToken";

const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
const removeToken = (): void => localStorage.removeItem(TOKEN_KEY);

const api = axios.create({
  baseURL: "http://localhost:5162/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // handle unauthorized errors (401)
    if (error.response?.status === 401 && !originalRequest._retry) {

      removeToken();
      window.location.href = '/login'; 
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// Auth helper methods
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response.data;
  },

  logout: () => {
    removeToken();
  },

  isAuthenticated: () => !!getToken(),
};

export default api;
