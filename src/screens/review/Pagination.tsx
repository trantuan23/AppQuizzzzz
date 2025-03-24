import { View, Text, TouchableOpacity } from "react-native";
import tw from "tailwind-react-native-classnames";

const Pagination = ({
  currentPage,
  totalQuestions,
  handleNextPage,
  handlePreviousPage,
}: any) => {
  const questionsPerPage = 3;
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);

  return (
    <View
      style={tw`flex flex-row justify-between mt-6 mx-auto w-full max-w-lg`}
    >
      <TouchableOpacity
        style={tw`px-4 py-2 border border-gray-400 rounded`}
        onPress={handlePreviousPage}
        disabled={currentPage === 0}
      >
        <Text>Trang trước</Text>
      </TouchableOpacity>
      <Text style={tw`self-center text-lg`}>
        Trang {currentPage + 1} / {totalPages}
      </Text>
      <TouchableOpacity
        style={tw`px-4 py-2 border border-gray-400 rounded`}
        onPress={handleNextPage}
        disabled={currentPage === totalPages - 1}
      >
        <Text>Trang tiếp</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Pagination;
