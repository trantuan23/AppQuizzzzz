import { API_URL } from "@env";
import axios from "axios";

export const fetchSubject = async () => {
    try {
        const response = await axios.get(`${API_URL}/subjects`);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy danh sách môn học:", error);

    }
};