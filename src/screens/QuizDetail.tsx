import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import tw from "twrnc";
import { RadioButton } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import useQuizDetail from "../../hook/useQuizDetail";
import { Answerstype } from "../../types/answers.type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

const QuizDetailScreen = ({ navigation }: { navigation: any }) => {
  const { quiz } = useQuizDetail();
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, Answerstype>
  >({});
  const [currentPage, setCurrentPage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);
  const itemsPerPage = 2;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Tạo một hàm sử dụng useCallback để tránh render lại không cần thiết
  const handleSelectAnswer = useCallback(
    (questionId: string, answer: Answerstype) => {
      setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
    },
    []
  );

  const handleSubmitQuiz = useCallback(async () => {
    try {
      if (isSubmitting) return; // Nếu đang gửi thì không cho gửi tiếp
      setIsSubmitting(true);
      const userId = await AsyncStorage.getItem("user_id");

      // Kiểm tra nếu thời gian còn lại > 0 thì cảnh báo, ngược lại thì nộp bài luôn
      if (timeLeft > 0) {
        // Tìm các câu chưa làm
        const unansweredQuestions = quiz?.questions
          ?.map((q: any, index: number) => ({
            index: index + 1,
            question_id: q.question_id,
            selected: selectedAnswers[q.question_id],
          }))
          .filter(
            (q: any) => !q.selected || Object.keys(q.selected).length === 0
          );

        if (unansweredQuestions.length > 0) {
          const questionNumbers = unansweredQuestions
            .map((q: any) => `Câu ${q.index}`)
            .join(", ");

          Alert.alert(
            "Cảnh báo",
            `Bạn chưa làm các câu: ${questionNumbers}. Bạn có chắc chắn muốn nộp bài không?`,
            [
              { text: "Tiếp tục làm bài", style: "cancel" },
              {
                text: "Vẫn nộp bài",
                onPress: async () => {
                  await submitQuiz(userId);
                },
              },
            ]
          );
          return;
        }
      }

      // Hết thời gian hoặc không có câu nào bỏ trống thì nộp bài luôn
      await submitQuiz(userId);
    } catch (error) {
      console.error("Lỗi khi gửi bài kiểm tra:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi gửi bài kiểm tra.");
    }
  }, [isSubmitting, quiz, selectedAnswers, timeLeft]);

  const submitQuiz = useCallback(
    async (userId: string | null) => {
      const requestData = {
        quizId: quiz?.quizz_id ?? "",
        userId,
        subjectId: quiz?.subject?.subject_id ?? "",
        answers:
          quiz?.questions?.map((q: any) => {
            const selected = selectedAnswers[q.question_id];
            return {
              question_id: q.question_id,
              question_text: q.question_text,
              selected_answer:
                selected && Object.keys(selected).length > 0
                  ? {
                      answer_id: selected.answer_id ?? "",
                      answer_text: selected.answer_text ?? "",
                      is_correct: selected.is_correct ?? false,
                    }
                  : {}, // Nếu không có đáp án, trả về object rỗng
            };
          }) ?? [],
      };

      try {
        const response = await fetch(`${API_URL}/results`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          console.error(
            `Error status: ${response.status}, Message: ${errorMessage}`
          );
          throw new Error(`Failed to submit quiz: ${errorMessage}`);
        }

        // Chuyển hướng sau khi nộp bài thành công
        navigation.navigate("Hệ thống thi trực tuyến");

        // Hiển thị thông báo thành công
        Alert.alert("Thành công", "Nộp bài thành công!");
      } catch (error) {
        console.error(error);

        // Hiển thị thông báo lỗi
        Alert.alert("Thất bại", "Nộp bài thất bại !");
      }
    },
    [selectedAnswers, quiz]
  );

  const totalPages = useMemo(() => {
    return quiz?.questions
      ? Math.ceil(quiz.questions.length / itemsPerPage)
      : 0;
  }, [quiz]);

  const displayedQuestions = useMemo(() => {
    return quiz?.questions
      ? quiz.questions.slice(
          currentPage * itemsPerPage,
          (currentPage + 1) * itemsPerPage
        )
      : [];
  }, [quiz, currentPage]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [handleSubmitQuiz]);

  return (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`p-4 bg-blue-500`}>
        <Text style={tw`text-white text-center text-lg font-semibold`}>
          Thời gian còn lại: {formatTime(timeLeft)}
        </Text>
      </View>
      <ScrollView contentContainerStyle={tw`p-4 pb-24`}>
        <Text style={tw`text-xl text-blue-600 text-center mb-2`}>
          {quiz?.title || "Loading..."}
        </Text>
        {quiz?.article && (
          <Text style={tw`text-gray-700 text-center mb-4`}>{quiz.article}</Text>
        )}
        {displayedQuestions.map((q: any, idx: any) => (
          <View
            key={q.question_id}
            style={tw`mb-4 p-4 rounded-lg border bg-gray-100`}
          >
            <Text style={tw`text-lg mb-2`}>
              Câu {currentPage * itemsPerPage + idx + 1}: {q.question_text}
            </Text>
            {q.answers.map((option: any) => (
              <TouchableOpacity
                key={option.answer_id}
                onPress={() => handleSelectAnswer(q.question_id, option)}
              >
                <View
                  style={tw`flex-row items-center mt-2 p-2 rounded-lg border bg-white`}
                >
                  <RadioButton
                    value={option.answer_id}
                    status={
                      selectedAnswers[q.question_id]?.answer_id ===
                      option.answer_id
                        ? "checked"
                        : "unchecked"
                    }
                    onPress={() => handleSelectAnswer(q.question_id, option)}
                  />
                  <Text style={tw`text-black ml-2 flex-1`}>
                    {option.answer_text}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
      <View
        style={tw`flex-row justify-between mb-4 mx-2 p-4 bg-white rounded-xl shadow-md `}
      >
        {/* Nút về trang đầu */}
        <TouchableOpacity
          onPress={() => setCurrentPage(0)}
          disabled={currentPage === 0}
        >
          <Icon
            name="chevron-back"
            size={36}
            color={currentPage === 0 ? "#A0A0A0" : "#2563EB"}
          />
        </TouchableOpacity>

        {/* Hiển thị số trang */}
        <View style={tw`px-4 py-1 bg-indigo-100 rounded-lg`}>
          <Text style={tw`text-lg font-semibold text-indigo-700`}>
            {currentPage + 1}/{totalPages}
          </Text>
        </View>

        {/* Nút đến trang cuối */}
        <TouchableOpacity
          onPress={() => setCurrentPage(totalPages - 1)}
          disabled={currentPage === totalPages - 1}
        >
          <Icon
            name="chevron-forward"
            size={36}
            color={currentPage === totalPages - 1 ? "#A0A0A0" : "#2563EB"}
          />
        </TouchableOpacity>

        {/* Nút Reset câu trả lời */}
        <TouchableOpacity onPress={() => setSelectedAnswers({})}>
          <Icon name="refresh" size={36} color="red" />
        </TouchableOpacity>

        {/* Nút nộp bài */}
        <TouchableOpacity onPress={handleSubmitQuiz}>
          <Icon name="checkmark-circle-outline" size={36} color="green" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QuizDetailScreen;
