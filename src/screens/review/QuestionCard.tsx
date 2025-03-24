import React, { memo } from "react";
import { ScrollView, View, Text } from "react-native";
import { RadioButton } from "react-native-paper";
import tw from "tailwind-react-native-classnames";

const QuestionCard = ({ question, index, selectedAnswers }: any) => {
  if (!question) {
    return (
      <View style={tw`p-4 bg-white rounded-lg shadow-md my-2`}>
        <Text style={tw`text-red-600 font-bold`}>⚠ Dữ liệu câu hỏi bị lỗi</Text>
      </View>
    );
  }
  return (
    <ScrollView style={tw`mb-6`} showsVerticalScrollIndicator={false}>
      <Text style={tw`text-xl pt-6 text-gray-900 mt-2`}>
        Câu {index + 1}: {question.question_text}
      </Text>

      {question.question_type === "audio_guess" && question.media_url && (
        <audio
          controls
          src={question.media_url}
          className="mt-2 mb-4 w-full rounded-md shadow-sm"
        />
      )}

      {question.answers.map((answer: any) => {
        const isSelected = selectedAnswers.includes(answer.answer_id); // Kiểm tra xem câu trả lời có được chọn không
        const isCorrect = answer.is_correct; // Kiểm tra xem đây có phải là câu trả lời đúng không
        const answerStatus = isSelected
          ? isCorrect
            ? "true" // Người dùng chọn đúng
            : "false" // Người dùng chọn sai
          : isCorrect
          ? "null" // Đáp án đúng nhưng chưa được chọn
          : ""; // Câu trả lời không liên quan

        return (
          <View
            key={answer.answer_id}
            style={[
              tw`pt-4 p-4 rounded-lg shadow-md mt-2 flex-row items-center`,
              answerStatus === "true"
                ? tw`bg-green-100 border-l-4 border-green-500`
                : answerStatus === "false"
                ? tw`bg-red-100 border-l-4 border-red-500`
                : answerStatus === "null"
                ? tw`bg-green-50 border-l-4 border-green-400`
                : tw`bg-white`,
            ]}
          >
            <RadioButton
              value={answer.answer_id}
              status={isSelected ? "checked" : "unchecked"}
            />
            <View style={tw`ml-2 flex-1`}>
              <Text style={tw`text-lg font-medium`}>{answer.answer_text}</Text>

              {isSelected && (
                <Text
                  style={[
                    tw`text-sm font-semibold mt-1`,
                    answerStatus === "false"
                      ? tw`text-red-600`
                      : answerStatus === "true"
                      ? tw`text-green-600`
                      : tw`text-gray-500`,
                  ]}
                >
                  {answerStatus === "true"
                    ? "(Bạn đã trả lời đúng câu này)"
                    : "(Bạn đã trả lời sai câu này)"}
                </Text>
              )}

              {!isSelected && answerStatus === "null" && (
                <Text style={tw`text-sm font-semibold text-green-500 mt-1`}>
                  (Đây là câu trả lời đúng)
                </Text>
              )}

              {(answerStatus === "true" ||
                answerStatus === "false" ||
                answerStatus === "null") &&
                answer.reason && (
                  <Text style={tw`mt-2 text-sm text-gray-600 italic`}>
                    {answer.reason}
                  </Text>
                )}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default memo(QuestionCard);
