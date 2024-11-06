import axios from 'axios';
import config from '../config/default'

class API {
  constructor() {
    if (!API.instance) {
      this.api = axios.create({
        baseURL: config.baseUrl,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      // Intercept requests to add the token
      this.api.interceptors.request.use(
        (config) => {
          const token = localStorage.getItem('token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          } else {
            console.log("Token not found in localStorage."); // Check if token is missing
          }
          return config;
        },
        (error) => {
          console.error("Interceptor error:", error); 
          Promise.reject(error)
        }
      );

      // Intercept responses to handle token validation
      this.api.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response && error.response.status === 401) {
            // Handle token expiration or invalid token
            localStorage.removeItem('token');
            // Optionally redirect to login page or show a message
          }
          return Promise.reject(error);
        }
      );

      API.instance = this;
    }

    return API.instance;
  }

  getInstance() {
    return this.api;
  }
}

const api = new API().getInstance();
export default api;