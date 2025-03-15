import axios from 'axios';

export const Axios = axios.create({
    baseURL: __API_URL__,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor to add auth token
Axios.interceptors.request.use(
    (config) => {
        const auth = localStorage.getItem('auth');
        if (auth) {
            const { token } = JSON.parse(auth);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
