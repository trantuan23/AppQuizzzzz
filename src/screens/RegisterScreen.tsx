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

import { fetchClasses } from "../../api/class";
import { register } from "../../api/auth";
import DropDownPicker from "react-native-dropdown-picker";
import tw from "tailwind-react-native-classnames";

export default function RegisterScreen({ navigation }: { navigation: any }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [classId, setClassId] = useState("");
  const [classes, setClasses] = useState([]); // Lưu danh sách lớp

  // State mở dropdown riêng biệt
  const [openRole, setOpenRole] = useState(false);
  const [openClass, setOpenClass] = useState(false);

  // Danh sách role
  const [items, setItems] = useState([
    { label: "Học sinh", value: "student" },
    { label: "Giáo viên", value: "teacher" },
  ]);

  // Cập nhật danh sách lớp khi API trả về dữ liệu
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const classData = await fetchClasses();
        setClasses(classData.data);
      } catch (error) {
        Alert.alert("Lỗi", "Không thể tải danh sách lớp học!");
      }
    };
    loadClasses();
  }, []);

  // Cập nhật danh sách lớp khi state classes thay đổi
  const itemsClass = classes.map((item: any) => ({
    label: item?.class_name || "Không xác định",
    value: item?.class_id,
  }));

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu không khớp!");
      return;
    }

    try {
      const userData = {
        username,
        email,
        password,
        role,
        classId: role === "student" ? classId : null,
      };
      await register(userData);
      Alert.alert("Thành công", "Đăng ký thành công!");
      navigation.navigate("Đăng nhập hệ thống");
    } catch (error: any) {
      if (error.response?.data?.message) {
        Alert.alert("Lỗi", error.response.data.message);
      } else {
        Alert.alert("Lỗi", "Đăng ký thất bại. Vui lòng thử lại!");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1 p-6 bg-gray-100`}
    >
      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-600 mb-2`}>Tên người dùng</Text>
        <TextInput
          placeholder="Nhập tên người dùng"
          style={tw`border border-gray-300 p-3 rounded-lg bg-white`}
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-600 mb-2`}>Email</Text>
        <TextInput
          placeholder="Nhập email"
          style={tw`border border-gray-300 p-3 rounded-lg bg-white`}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-600 mb-2`}>Mật khẩu</Text>
        <TextInput
          placeholder="Nhập mật khẩu"
          style={tw`border border-gray-300 p-3 rounded-lg bg-white`}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-600 mb-2`}>Xác nhận mật khẩu</Text>
        <TextInput
          placeholder="Nhập lại mật khẩu"
          style={tw`border border-gray-300 p-3 rounded-lg bg-white`}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-600 mb-2`}>Chọn vai trò</Text>
        <DropDownPicker
          open={openRole}
          value={role}
          items={items}
          setOpen={(val: any) => {
            setOpenRole(val);
            if (val) setOpenClass(false); // Đóng dropdown lớp học khi mở vai trò
          }}
          setValue={setRole}
          setItems={setItems}
          placeholder="Chọn vai trò"
          style={tw`border border-gray-300 p-3 rounded-lg bg-white`}
          dropDownContainerStyle={tw`bg-white border border-gray-300 rounded-lg`}
          zIndex={3000} // Đảm bảo dropdown hiển thị trên cùng
          zIndexInverse={1000}
        />
      </View>

      {role === "student" && (
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-600 mb-2`}>Chọn lớp học</Text>
          <DropDownPicker
            open={openClass}
            value={classId}
            items={itemsClass}
            setOpen={(val: any) => {
              setOpenClass(val);
              if (val) setOpenRole(false); // Đóng dropdown vai trò khi mở lớp học
            }}
            setValue={setClassId}
            placeholder="Chọn lớp học"
            style={tw`border border-gray-300 p-3 rounded-lg bg-white`}
            dropDownContainerStyle={tw`bg-white border border-gray-300 rounded-lg`}
            zIndex={2000} // Giữ dropdown lớp học dưới dropdown vai trò
            zIndexInverse={900}
          />
        </View>
      )}

      <TouchableOpacity
        onPress={handleRegister}
        style={tw`bg-blue-500 p-4 rounded-lg mb-3`}
      >
        <Text style={tw`text-white text-center font-semibold text-lg`}>
          Đăng Ký
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Đăng nhập hệ thống")}
      >
        <Text style={tw`text-blue-500 text-center text-lg`}>
          Quay lại Đăng Nhập
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
