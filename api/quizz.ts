import axios from "axios";
import { Quiz } from "../types/quizz.type";
import { API_URL } from "@env";

export const fetchQuizzes = async (): Promise<Quiz[]> => {
  try {
    const response = await axios.get(`${API_URL}/quizzes`, {
      withCredentials: true,
    });

    if (!response.data || !response.data.data) {
      throw new Error("Dữ liệu API không hợp lệ.");
    }

    return response.data.data;
  } catch (error: unknown) {
    console.error("Lỗi khi lấy danh sách quiz:", error);
    throw new Error("Không thể lấy danh sách quiz.");
  }
};
