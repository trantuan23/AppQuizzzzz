import axios from "axios";
import { API_URL } from "@env";

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.log("Server Error:", {
                status: error.response.status,
                data: error.response.data,
            });
        } else if (error.request) {
            console.log("Network Error: Không thể kết nối đến API", error.request);
        } else {
            console.log("Axios Error:", error.message);
        }
        throw error;
    }
};

export const register = async (userData: any) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.log("Server Error:", {
                status: error.response.status,
                data: error.response.data,
            });
        } else if (error.request) {
            console.log("Network Error: Không thể kết nối đến API", error.request);
        } else {
            console.log("Axios Error:", error.message);
        }
        throw error;
    }
}

export const LogoutAuth = async (userId: string) => {
    const response = await axios.post(`${API_URL}/auth/logout`, { userId });
    return response.data;
};


