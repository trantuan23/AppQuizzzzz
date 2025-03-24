import React, { useEffect, useState, useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";
import Icon from "react-native-vector-icons/Ionicons";
import tw from "tailwind-react-native-classnames";
import { fetchQuizzes } from "../../api/quizz";
import { fetchSubject } from "../../api/subject";
import { Quiz } from "../../types/quizz.type";
import { Subject } from "../../types/subject.type";
import { LogoutAuth } from "../../api/auth";

import { useDispatch } from "react-redux";
import { setQuizzId } from "../../redux/quizSlice";

export default function HomeScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("");
  const [time, setTime] = useState(new Date());
  const [dataQuizz, setDataQuizz] = useState<Quiz[]>([]);
  const [subjectList, setSubjectList] = useState<Subject[]>([]);

  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const [subjectOpen, setSubjectOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4; // Số bài kiểm tra trên mỗi trang

  const dispatch = useDispatch();
  const handleSelectQuiz = (id: string) => {
    dispatch(setQuizzId(id));
    navigation.navigate("Làm bài kiểm tra");
  };

  useEffect(() => {
    (async () => {
      await checkLogin();
      await fetchData();
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkLogin = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      navigation.navigate("Đăng nhập hệ thống");
      return;
    }

    const storedEmail = await AsyncStorage.getItem("user_email");
    if (storedEmail && storedEmail !== email) {
      setEmail(storedEmail);
    }
  };

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

  const fetchData = async () => {
    try {
      const [subjects, quizzes] = await Promise.all([
        fetchSubject(),
        fetchQuizzes(),
      ]);

      // Chỉ cập nhật state khi dữ liệu thay đổi
      setSubjectList((prev) =>
        JSON.stringify(prev) !== JSON.stringify(subjects) ? subjects : prev
      );
      setDataQuizz((prev) =>
        JSON.stringify(prev) !== JSON.stringify(quizzes) ? quizzes : prev
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Lọc bài kiểm tra theo môn học và lớp
  const filteredQuizzes = useMemo(() => {
    if (!selectedSubject && !selectedClass) return dataQuizz; // Không cần lọc nếu không có bộ lọc

    return dataQuizz.filter((quiz) => {
      return (
        (!selectedSubject || quiz.subject.subject_id === selectedSubject) &&
        (!selectedClass || quiz.classes.includes(selectedClass))
      );
    });
  }, [dataQuizz, selectedSubject, selectedClass]);

  const paginatedQuizzes = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredQuizzes.slice(startIndex, startIndex + pageSize);
  }, [filteredQuizzes, currentPage]);

  // Tổng số trang
  const totalPages = Math.ceil(filteredQuizzes.length / pageSize);

  return (
    <View style={tw`flex-1 p-5 mt-5 bg-blue-50`}>
      <View style={tw`mb-4 items-center pt-8`}>
        <Text style={tw`text-3xl font-bold text-blue-700`}>
          Hệ thống thi trực tuyến
        </Text>
      </View>
      <View style={tw`mb-4 relative items-center pt-12`}>
        {/* Chọn Môn Học */}
        <DropDownPicker
          open={subjectOpen}
          value={selectedSubject}
          items={subjectList.map((sub) => ({
            label: sub.subject_name,
            value: sub.subject_id,
          }))}
          setOpen={(open: any) => {
            setSubjectOpen(open);
            if (open) setClassOpen(false);
          }}
          setValue={setSelectedSubject}
          placeholder="Chọn môn học"
          containerStyle={{ zIndex: subjectOpen ? 1000 : 1 }}
          style={tw`border border-gray-300 rounded-xl`}
          dropDownContainerStyle={tw`border border-gray-300 bg-white`}
        />

        {/* Hiển thị nút Xóa Bộ Lọc chỉ khi có bộ lọc được chọn */}
        {selectedSubject && (
          <TouchableOpacity
            style={tw`bg-gray-300 py-2 px-4 rounded-xl mt-3 flex-row items-center justify-center`}
            onPress={() => {
              setSelectedSubject(null);
              setSelectedClass(null);
            }}
          >
            <Icon name="close" size={20} color="#4A4A4A" style={tw`mr-2`} />
            <Text style={tw`text-gray-800 font-semibold`}>Xóa bộ lọc</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView>
        {paginatedQuizzes.length > 0 ? (
          paginatedQuizzes.map((item) => (
            <TouchableOpacity
              key={item.quizz_id}
              style={tw`bg-white border border-gray-200 p-5 rounded-xl shadow-md mb-2 justify-between`}
              onPress={() => handleSelectQuiz(item.quizz_id)}
            >
              <View>
                <Text style={tw`text-xl font-semibold text-gray-800`}>
                  {item.title}
                </Text>
                <Text style={tw`text-gray-600`}>
                  {item.time
                    ? `${Math.floor(item.time / 60)} phút`
                    : "Không giới hạn"}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={tw`text-gray-500 text-center mt-5 text-lg`}>
            Không có dữ liệu
          </Text>
        )}

        {totalPages >= 1 ? (
          <View style={tw`items-center mt-4`}>
            <Text style={tw`text-lg font-semibold`}>
              Trang {currentPage} / {totalPages}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Thanh điều hướng với phân trang */}
      <View
        style={tw`flex-row justify-between mt-4 p-4 bg-white rounded-xl shadow-md`}
      >
        <TouchableOpacity
          onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <Icon
            name="chevron-back"
            size={32}
            color={currentPage === 1 ? "#A0A0A0" : "#2563EB"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          <Icon
            name="chevron-forward"
            size={32}
            color={currentPage === totalPages ? "#A0A0A0" : "#2563EB"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Hồ sơ người dùng")}
        >
          <Icon name="person" size={32} color="#4A4A4A" />
        </TouchableOpacity>
        {/* Đăng xuất */}
        <TouchableOpacity onPress={handleLogout}>
          <TouchableOpacity onPress={handleLogout}>
            <Icon name="log-out" size={32} color="#000000" />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </View>
  );
}
