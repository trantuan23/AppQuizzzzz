import { API_URL } from "@env";
import axios from "axios";

export const fetchClasses = async () => {
    try {
        const response = await axios.get(`${API_URL}/classes`);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy danh sách lớp:", error);

    }
};