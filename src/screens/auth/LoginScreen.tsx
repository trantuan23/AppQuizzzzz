import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "tailwind-react-native-classnames";
import { login, register } from "../../../api/auth";
import { fetchClasses } from "../../../api/class";
import { Class } from "../../../types/class.type";

export default function AuthScreen({ navigation }: { navigation: any }) {
  const [isLogin, setIsLogin] = useState(true); // Toggle giữa đăng nhập và đăng ký

  // State cho đăng nhập
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State cho đăng ký
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [classId, setClassId] = useState("");
  const [classes, setClasses] = useState<Class[]>([]);
  const [openRole, setOpenRole] = useState(false);
  const [openClass, setOpenClass] = useState(false);
  const [items, setItems] = useState([
    { label: "Học sinh", value: "student" },
    { label: "Giáo viên", value: "teacher" },
  ]);

  useEffect(() => {
    if (!isLogin) loadClasses();
  }, [isLogin]);

  const loadClasses = async () => {
    try {
      const classData = await fetchClasses();
      setClasses(classData.data);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách lớp học!");
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        "Lỗi",
        "Vui lòng nhập đầy đủ thông tin và kiểm tra mật khẩu!"
      );
      return;
    }

    try {
      const response = await login(email, password);

      // Kiểm tra nếu API trả về lỗi
      if (!response.success) {
        Alert.alert("Lỗi", response.error || "Đăng nhập thất bại!");
        return;
      }

      await AsyncStorage.setItem("access_token", response.data.access_token);
      await AsyncStorage.setItem("user_email", email);
      await AsyncStorage.setItem("user_id", response.data.user_id);

      navigation.navigate("Hệ thống thi trực tuyến");
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleRegister = async () => {
    if (!username || !email || !password || password !== confirmPassword) {
      Alert.alert(
        "Lỗi",
        "Vui lòng nhập đầy đủ thông tin và kiểm tra mật khẩu!"
      );
      return;
    }
    try {
      await register({
        username,
        email,
        password,
        role,
        classId: role === "student" ? classId : null,
      });
      Alert.alert("Thành công", "Đăng ký thành công!");
      setIsLogin(true);
    } catch (error) {
      const errorMessage =
        (error as any)?.response?.data?.message || "Đăng ký thất bại!";
      Alert.alert("Lỗi", errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1 p-6 bg-gray-100`}
    >
      {isLogin ? (
        <View>
          <Text style={tw`text-center mt-48 font-semibold text-2xl pt-12`}>
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
          >
            <Text style={tw`text-white text-center font-semibold`}>
              Đăng nhập
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsLogin(false)}>
            <Text style={tw`text-blue-700 text-center mt-2`}>
              Chưa có tài khoản đăng ký ngay
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Quên mật khẩu");
            }}
          >
            <Text style={tw`text-blue-700 text-center mt-2`}>
              Quên mật khẩu
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={tw`text-center font-semibold text-2xl mt-24 pt-12`}>
            Đăng ký tài khoản
          </Text>
          <TextInput
            placeholder="Tên người dùng"
            style={tw`border border-gray-300 p-3 mb-4 rounded-lg bg-white mt-8`}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            placeholder="Email"
            style={tw`border border-gray-300 p-3 mb-4 rounded-lg bg-white`}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Mật khẩu"
            style={tw`border border-gray-300 p-3 mb-4 rounded-lg bg-white`}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            placeholder="Xác nhận mật khẩu"
            style={tw`border border-gray-300 p-3 mb-4 rounded-lg bg-white`}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <DropDownPicker
            open={openRole}
            value={role}
            items={items}
            setOpen={setOpenRole}
            setValue={setRole}
            setItems={setItems}
            placeholder="Chọn vai trò"
            style={tw`border border-gray-300 p-3 rounded-lg bg-white`}
            dropDownContainerStyle={tw`bg-white border border-gray-300 rounded-lg`}
            zIndex={3000}
          />
          {role === "student" && (
            <DropDownPicker
              open={openClass}
              value={classId}
              items={classes.map((item) => ({
                label: item.class_name,
                value: item.class_id,
              }))}
              setOpen={setOpenClass}
              setValue={setClassId}
              placeholder="Chọn lớp học"
              style={tw`border border-gray-300 p-3 rounded-lg bg-white mt-4`}
              dropDownContainerStyle={tw`bg-white border border-gray-300 rounded-lg`}
              zIndex={2000}
            />
          )}
          <TouchableOpacity
            onPress={handleRegister}
            style={tw`bg-blue-500 p-4 rounded-lg mt-2`}
          >
            <Text style={tw`text-white text-center font-semibold`}>
              Đăng ký
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsLogin(true)}>
            <Text style={tw`text-blue-700 text-center mt-2`}>
              Quay lại đăng nhập
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
