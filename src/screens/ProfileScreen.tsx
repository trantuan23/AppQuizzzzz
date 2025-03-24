import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { API_URL } from "@env";
import { QuizResult, UserProfile } from "../../types/user.type";
import tw from "tailwind-react-native-classnames";
import { LogoutAuth } from "../../api/auth";
import { useDispatch } from "react-redux";
import { setReviewId } from "../../redux/resultSlice";

export const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userData, setUserData] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 2;

  const dispatch = useDispatch();
  const handleSelectReview = (id: string) => {
    dispatch(setReviewId(id));
    navigation.navigate("Xem lại bài kiểm tra");
  };

  const fetchUserProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id");
      if (!userId) return;

      const response = await axios.get(`${API_URL}/users/${userId}`);
      setUser(response.data);
      setUserData(response.data.results || []);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin hồ sơ:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id");
      if (!userId) throw new Error("Không tìm thấy user_id");

      await LogoutAuth(userId);
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    } finally {
      await AsyncStorage.multiRemove(["access_token", "user_id"]);
      navigation.reset({
        index: 0,
        routes: [{ name: "Đăng nhập hệ thống" }],
      });
    }
  }, [navigation]);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
        <ActivityIndicator size="large" color="#6200ea" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
        <Text style={tw`text-red-500 text-lg font-bold`}>
          Không thể tải thông tin người dùng.
        </Text>
      </View>
    );
  }

  const totalPages = Math.ceil(userData.length / itemsPerPage);
  const displayedData = userData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <View
        style={tw`bg-white shadow-lg rounded-xl mx-4 p-6 mt-6 items-center`}
      >
        {/* Ảnh đại diện */}
        <Image
          source={{
            uri: "https://static.vecteezy.com/system/resources/previews/002/318/271/non_2x/user-profile-icon-free-vector.jpg",
          }}
          style={tw`w-12 h-12 rounded-full border-4 border-indigo-500 shadow-md`}
        />

        {/* Thông tin người dùng */}
        <Text style={tw`text-2xl font-semibold text-indigo-700 mt-3`}>
          {user?.username}
        </Text>
        <Text style={tw`text-gray-600 text-base`}>{user.email}</Text>

        {/* Vai trò và lớp học */}
        <View style={tw`mt-2 bg-indigo-100 px-3 py-1 rounded-lg`}>
          <Text style={tw`text-indigo-700 font-medium`}>
            Vai trò: {user.role}
          </Text>
        </View>

        {user.class && (
          <View style={tw`mt-2 bg-green-100 px-3 py-1 rounded-lg`}>
            <Text style={tw`text-green-700 font-medium`}>
              Lớp học: {user.class.class_name}
            </Text>
          </View>
        )}
      </View>

      <FlatList
        data={displayedData}
        keyExtractor={(item) => item.result_id.toString()}
        renderItem={({ item }) => (
          <View
            style={tw`bg-white p-4 m-2 rounded-lg shadow-lg  border-indigo-500`}
          >
            <Text style={tw`text-lg font-bold text-indigo-700`}>
              {item.quizzes.title}
            </Text>
            <Text style={tw`text-gray-600`}>
              Môn học: {item.quizzes.subject.subject_name}
            </Text>
            <Text style={tw`text-gray-600`}>
              Điểm: {item.score || "Chưa có điểm"}
            </Text>
            <Text style={tw`text-gray-600`}>
              Hoàn thành: {new Date(item.completed_at).toLocaleString()}
            </Text>
            <TouchableOpacity
              style={tw`bg-indigo-600 p-2 rounded mt-2 items-center`}
              onPress={() => handleSelectReview(item.result_id)}
            >
              <Text style={tw`text-white font-bold`}>Xem chi tiết</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View
        style={tw`flex-row items-center justify-between mx-4 p-2 bg-white rounded-xl shadow-md`}
      >
        {/* Nút Previous */}
        <TouchableOpacity
          onPress={() => setPage(page - 1)}
          disabled={page <= 1}
          style={tw`p-2 ${page <= 1 ? "text-gray-900" : ""}`}
        >
          <Icon name="chevron-back" size={36} style={tw`text-gray-600`} />
        </TouchableOpacity>

        {/* Hiển thị số trang */}
        <View style={tw`px-5 py-2 bg-indigo-100 rounded-lg`}>
          <Text style={tw`text-lg font-semibold text-indigo-700`}>
            {page}/{totalPages}
          </Text>
        </View>

        {/* Nút Next */}
        <TouchableOpacity
          onPress={() => setPage(page + 1)}
          disabled={page >= totalPages}
          style={tw`p-2 ${page >= totalPages ? "opacity-50" : ""}`}
        >
          <Icon name="chevron-forward" size={36} style={tw`text-gray-600`} />
        </TouchableOpacity>

        {/* Nút Đăng xuất */}
        <TouchableOpacity onPress={handleLogout} style={tw`p-2`}>
          <Icon name="log-out" size={36} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
