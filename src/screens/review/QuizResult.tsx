import { View, Text } from "react-native";
import tw from "tailwind-react-native-classnames";

const QuizResult = ({ correct, totalQuestions }: any) => {
  return (
    <View style={tw`mt-6 flex flex-row justify-center`}>
      <View style={tw`text-center`}>
        <Text style={tw`text-lg text-gray-700`}>
          Câu đúng: <Text style={tw`text-green-600`}>{correct}</Text> /{" "}
          {totalQuestions}
        </Text>
      </View>
      <View style={tw`text-center`}>
        <Text style={tw`text-lg text-gray-700 font-semibold`}>
          Điểm số:{" "}
          <Text style={tw`text-indigo-500`}>
            {((correct / totalQuestions) * 100).toFixed(2)}
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default QuizResult;
