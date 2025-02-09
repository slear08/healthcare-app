import axios from 'axios';

export const Axios = axios.create({
    baseURL: __API_URL__,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});
