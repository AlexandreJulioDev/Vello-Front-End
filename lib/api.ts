import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3001', 
});

// Interceptor de Requisição (Envia o Token)
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('@Vello:token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de Resposta (Lida com Token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o back-end retornar 401, removemos o token e voltamos ao login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('@Vello:token');
        // window.location.href = '/'; // Desabilitado temporariamente para permitir o modo Fallback
      }
    }
    return Promise.reject(error);
  }
);
