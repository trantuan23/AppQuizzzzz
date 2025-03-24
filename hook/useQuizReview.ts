import { useState, useEffect, useRef } from "react";
import { Alert } from "react-native";
import { QuizData } from "../types/review.type";
import { API_URL } from "@env";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export function useQuizReview() {
    const [quiz, setQuiz] = useState<QuizData>({
        quizz_id: "",
        title: "",
        description: "",
        time: 0,
        score: "",
        questions: [],
        article: "",
        result_id: "",
    });
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
    const [timeLeft, setTimeLeft] = useState(5400);
    const reviewId = useSelector((state: RootState) => state.review.reviewId);

    // Dùng useRef để theo dõi ID đã fetch
    const lastFetchedId = useRef<string | null>(null);

    const fetchData = async () => {
        try {
            if (!reviewId || lastFetchedId.current === reviewId) return; // Nếu đã fetch, không gọi lại API
            lastFetchedId.current = reviewId;

            const response = await fetch(`${API_URL}/results/${reviewId}`);
            if (!response.ok) throw new Error("Failed to fetch quiz data");

            const quizData = await response.json();
            setQuiz({
                quizz_id: quizData.quizzes?.quizz_id || "",
                score: quizData.score || "",
                result_id: reviewId,
                title: quizData.quizzes?.title || "",
                description: quizData.quizzes?.description || "",
                time: quizData.quizzes?.time || 0,
                questions: Array.isArray(quizData.quizzes?.questions)
                    ? quizData.quizzes.questions
                    : [],
                article: quizData.quizzes?.article || "",
            });
            setSelectedAnswers(quizData.answer_ids || []);
            setTimeLeft(quizData.quizzes?.time || 0);
        } catch (error) {
            Alert.alert("Lỗi", "Không thể lấy dữ liệu quiz.");
        }
    };

    useEffect(() => {
        if (reviewId && lastFetchedId.current !== reviewId) {
            fetchData();
        }
    }, [reviewId]);


    return { quiz, selectedAnswers, timeLeft, setTimeLeft };
}
