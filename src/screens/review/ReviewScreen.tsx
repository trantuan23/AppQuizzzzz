import { useState, useMemo, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "tailwind-react-native-classnames";
import QuestionCard from "./QuestionCard";
import QuizResult from "./QuizResult";
import { useQuizReview } from "../../../hook/useQuizReview";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";

export default function ReviewScreen() {
  const { quiz, selectedAnswers, timeLeft, setTimeLeft } = useQuizReview();
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 3;

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const totalPages = Math.ceil(quiz.questions.length / questionsPerPage);

  const displayedQuestions = useMemo(() => {
    return quiz.questions.slice(
      (currentPage - 1) * questionsPerPage,
      currentPage * questionsPerPage
    );
  }, [quiz.questions, currentPage, questionsPerPage]);

  // Hàm xử lý đăng xuất (thêm nếu cần)
  const handleLogout = () => {
    console.log("User logged out");
  };

  const calculateScore = () => {
    let correct = 0;
    let incorrect = 0;
    quiz.questions.forEach((question: any) => {
      question.answers.forEach((answer: any) => {
        if (selectedAnswers.includes(answer.answer_id)) {
          if (answer.is_correct) correct++;
          else incorrect++;
        }
      });
    });
    return { correct, incorrect };
  };

  const { correct, incorrect } = calculateScore();

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {/* Nội dung chính */}
      <ScrollView style={tw`pt-16 p-4`} showsVerticalScrollIndicator={false}>
        <Text style={tw`text-3xl font-bold text-indigo-600 text-center`}>
          {quiz.title}
        </Text>
        <Text style={tw`text-lg mt-2 text-center text-gray-700`}>
          {quiz.article}
        </Text>

        {displayedQuestions.map((question, index) => (
          <QuestionCard
            key={question.question_id}
            question={question}
            index={(currentPage - 1) * questionsPerPage + index}
            selectedAnswers={selectedAnswers}
          />
        ))}

        <QuizResult correct={correct} totalQuestions={quiz.questions.length} />
      </ScrollView>

      {/* Thanh điều hướng */}
      <View
        style={tw`flex-row items-center justify-between mx-4 my-2 p-3 bg-white rounded-xl shadow-lg`}
      >
        {/* Nút Previous */}
        <TouchableOpacity
          onPress={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage <= 1}
          style={tw`p-2 ${currentPage <= 1 ? "opacity-50" : ""}`}
        >
          <Icon name="chevron-back" size={28} color="gray" />
        </TouchableOpacity>

        {/* Hiển thị số trang */}
        <View style={tw`px-5 py-2 bg-indigo-100 rounded-lg`}>
          <Text style={tw`text-lg font-semibold text-indigo-700`}>
            {currentPage}/{totalPages}
          </Text>
        </View>

        {/* Nút Next */}
        <TouchableOpacity
          onPress={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          style={tw`p-2 ${currentPage >= totalPages ? "opacity-50" : ""}`}
        >
          <Icon name="chevron-forward" size={28} color="gray" />
        </TouchableOpacity>

        {/* Nút Đăng xuất */}
        <TouchableOpacity onPress={handleLogout} style={tw`p-2`}>
          <Icon name="log-out" size={28} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
