import axios from "axios";

const BASE_URL = "https://commend-wizard-stoke.ngrok-free.dev"; // Replace with your actual API base URL
export const endpoints = {
    'login' : "/o/token/",
    'register': "/api/users/users/",    
    'users':'/api/users/users/',
    'current_user': '/api/users/users/current_user/',
    'divisions': '/api/divisions/divisions/',
    'division': (id) => `/api/divisions/divisions/${id}/`,
    'registrations': '/api/divisions/divisionregistrations/',
    'registrationWaitingList': '/api/divisions/divisionregistrations/waiting-list/',
    'activities': "/api/activities/activities/",
    'activity_registrations': "/api/activities/registrations/",
    'activity_proofs': "/api/activities/proofs/",
    'activity_proof_images': "/api/activities/proof-images/",
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