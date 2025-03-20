import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

import { login } from "../../api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "tailwind-react-native-classnames";

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      await AsyncStorage.setItem("access_token", response.access_token);
      await AsyncStorage.setItem("user_email", email);
      await AsyncStorage.setItem("user_id", response.user_id);

      navigation.navigate("Hệ thống thi trực tuyến");
    } catch (error: any) {
      // Kiểm tra nếu API có phản hồi lỗi thì hiển thị chi tiết lỗi
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        Alert.alert("Lỗi", error.response.data.message);
      } else {
        Alert.alert("Lỗi", "Đăng nhập thất bại. Vui lòng thử lại!");
      }
    }
  };

  return (
    <View style={tw`flex-1 p-48 px-5 bg-gray-100`}>
      <Text style={tw`text-center font-semibold text-2xl pt-12`}>
        Đăng nhập hệ thống
      </Text>
      <TextInput
        placeholder="Email"
        style={tw`border border-gray-300 p-3 mb-4 rounded-lg bg-white mt-8`}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Mật khẩu"
        style={tw`border border-gray-300 p-3 mb-4 rounded-lg bg-white`}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        onPress={handleLogin}
        style={tw`bg-blue-500 p-4 rounded-lg`}
        activeOpacity={0.8} // Loại bỏ hiệu ứng giảm mờ
      >
        <Text style={tw`text-white text-center font-semibold`}>Đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate("Đăng kí hệ thống")}
      >
        <Text style={tw`text-blue-700 text-center mt-8`}>
          Chưa có tài khoản? Đăng ký ngay
        </Text>
      </TouchableOpacity>
    </View>
  );
}
