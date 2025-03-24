import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { API_URL } from "@env";
import { Quiz } from "../types/quizz.type";
import { RootState } from "../redux/store";

const useQuizDetail = () => {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const quizzId = useSelector((state: RootState) => state.quiz.quizzId);

    const fetchQuiz = useCallback(async () => {
        if (!quizzId) return;

        try {
            console.log("Gọi API lấy quiz:", quizzId);
            const response = await fetch(`${API_URL}/quizzes/${quizzId}`);
            if (!response.ok) throw new Error(`Lỗi ${response.status}: Không thể lấy dữ liệu quiz.`);

            const data = await response.json();
            console.log("Dữ liệu nhận được từ API:", data);
            setQuiz(data);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    }, [quizzId]);

    useEffect(() => {
        fetchQuiz();
    }, [fetchQuiz]);

    return { quiz };
};

export default useQuizDetail;
