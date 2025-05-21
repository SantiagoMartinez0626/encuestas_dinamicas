import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const authService = {
  register: async (name: string, email: string, password: string) => {
    const response = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    return response.data;
  },
  forgotPassword: async (email: string) => {
    const response = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
    return response.data;
  },
};

export default authService; 