import axios from "axios";

const BASE_URL = "http://10.0.2.2:8000/"; // Replace with your actual API base URL
export const endpoints = {
    'login' : "/o/token/",
    'register': "/api/users/users/",
    'users':'/api/users/users/',
    'current_user': '/api/users/users/current_user/',
    'divisions': '/api/divisions/divisions/',

};

export const authApis = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
};

export default axios.create({
  baseURL: BASE_URL
});