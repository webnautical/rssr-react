import axios from 'axios'
import { apiBaseURL } from 'components/Utility/Utility';
import { getAllLocatData } from 'components/Utility/Utility';
export const axiosInstance = axios.create({
    baseURL: apiBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
function getAuthToken() {
    return getAllLocatData()?.token
}

export const apiCall = async (endPoint = '', method = 'GET', value = null) => {
    try {
        const response = await axiosInstance({
            method: method,
            url: endPoint,
            data: value
        });
        return response.data;
    } catch (error) {
        console.log(error)
    }
};