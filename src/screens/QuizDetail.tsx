import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchQuizQuestions } from "../../redux/quizSlice";
import tw from "tailwind-react-native-classnames";

export default function QuizDetailScreen() {
  const route = useRoute();
  const { quizId } = route.params as { quizId: string };
  const dispatch = useAppDispatch();
  const { questions, loading } = useAppSelector((state) => state.quiz);

  useEffect(() => {
    dispatch(fetchQuizQuestions(quizId));
  }, [dispatch, quizId]);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-900`}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-900 p-4`}>
      <Text style={tw`text-white text-2xl font-bold mb-4`}>
        Danh sách câu hỏi
      </Text>
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={tw`bg-gray-800 p-4 mb-3 rounded-xl`}>
            <Text style={tw`text-white text-lg`}>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
}
