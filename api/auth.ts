import axios from "axios";
import { API_URL } from "@env";

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        return { success: true, data: response.data };
    } catch (error: any) {
        if (error.response) {
            return {
                success: false,
                error: error.response.data.message || "Lỗi không xác định",
            };
        } else if (error.request) {

            return { success: false, error: "Không thể kết nối đến API" };
        } else {

            return { success: false, error: "Lỗi không xác định" };
        }
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


export const forgotPassword = async (email: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Có lỗi xảy ra.");
    }
};

export const verifyOtp = async (email: string, otpCode: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/verify-otp`, { email, otpCode });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Mã OTP không hợp lệ.");
    }
};


export const resetPassword = async (email: string, otpCode: string, newPassword: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/reset-password`, {
            email,
            otpCode,
            newPassword,
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Có lỗi xảy ra.");
    }
};



