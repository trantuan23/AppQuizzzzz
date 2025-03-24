import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import { forgotPassword, resetPassword, verifyOtp } from "../../../api/auth";
import Icon from "react-native-vector-icons/Ionicons";

export function ResetPasswordForm({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("");
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const otpRefs = useRef<TextInput[]>([]);

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      await forgotPassword(email);
      alert("Mã OTP đã được gửi. Vui lòng kiểm tra email.");
      setStep(2);
    } catch (error) {
      alert(
        "Lỗi: " +
          (error instanceof Error ? error.message : "Lỗi không xác định.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const formattedOtp = otpValues.join("");
    setLoading(true);
    try {
      const response = await verifyOtp(email, formattedOtp);
      if (response.message === "Mã OTP hợp lệ.") {
        alert("OTP hợp lệ! Đang chuyển bước...");
        setStep(3);
      } else {
        throw new Error(response.message || "OTP không hợp lệ");
      }
    } catch (error) {
      alert(
        "Lỗi: " +
          (error instanceof Error ? error.message : "Lỗi không xác định.")
      );
      setOtpValues(Array(6).fill(""));
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu không khớp.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email, otpValues.join(""), newPassword);
      alert("Cập nhật mật khẩu thành công.");
      setStep(1);
      setEmail("");
      setOtpValues(Array(6).fill(""));
      setNewPassword("");
      setConfirmPassword("");
      navigation.navigate("Đăng nhập hệ thống");
    } catch (error) {
      alert(
        "Lỗi: " +
          (error instanceof Error ? error.message : "Lỗi không xác định.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 mt-64 bg-gray-100 p-6`}>
      {step === 1 && (
        <View style={tw`w-full max-w-md p-4 bg-white rounded-lg shadow-lg`}>
          <Text style={tw`text-xl font-bold text-center text-blue-600 mb-4`}>
            Gửi email lấy lại mật khẩu
          </Text>
          <TextInput
            style={tw`border border-gray-300 p-4 rounded-md`}
            placeholder="Nhập email của bạn"
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity
            style={tw`bg-blue-500 p-3 rounded-lg mt-2`}
            onPress={handleForgotPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={tw`text-white text-center font-bold`}>
                Gửi mã OTP
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View style={tw`w-full max-w-md p-6 bg-white rounded-lg shadow-lg`}>
          <Text style={tw`text-xl font-bold text-center text-blue-600 mb-4`}>
            Nhập OTP
          </Text>
          <View style={tw`flex-row justify-center mb-4`}>
            {otpValues.map((val, index) => (
              <TextInput
                key={index}
                ref={(ref) => (otpRefs.current[index] = ref!)}
                style={tw`w-12 h-12 text-center text-lg border border-gray-300 rounded mx-1`}
                keyboardType="numeric"
                maxLength={1}
                value={val}
                onChangeText={(text) => {
                  const newOtpValues = [...otpValues];
                  newOtpValues[index] = text;
                  setOtpValues(newOtpValues);

                  if (text && index < otpValues.length - 1) {
                    otpRefs.current[index + 1]?.focus();
                  }
                }}
              />
            ))}
          </View>
          <TouchableOpacity
            style={tw`bg-blue-500 p-3 rounded-lg`}
            onPress={handleVerifyOtp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={tw`text-white text-center font-bold`}>
                Xác minh OTP
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {step === 3 && (
        <View style={tw`w-full max-w-md p-6 bg-white rounded-lg shadow-lg`}>
          <Text style={tw`text-xl font-bold text-center text-blue-600 mb-4`}>
            Đặt mật khẩu mới
          </Text>
          <View style={tw`relative mb-4`}>
            <TextInput
              style={tw`border border-gray-300 p-3 rounded-md pr-10`}
              placeholder="Nhập mật khẩu mới"
              secureTextEntry={!showPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity
              style={tw`absolute right-3 top-3`}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Icon name="eye-outline" size={24} />
              ) : (
                <Icon name="eye-off-outline" size={24} />
              )}
            </TouchableOpacity>
          </View>

          <View style={tw`relative mb-4`}>
            <TextInput
              style={tw`border border-gray-300 p-3 rounded-md pr-10`}
              placeholder="Xác nhận mật khẩu mới"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              style={tw`absolute right-3 top-3`}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <Icon name="eye-outline" size={24} />
              ) : (
                <Icon name="eye-off-outline" size={24} />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={tw`bg-blue-500 p-3 rounded-lg`}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={tw`text-white text-center font-bold`}>
                Cập nhật mật khẩu
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
