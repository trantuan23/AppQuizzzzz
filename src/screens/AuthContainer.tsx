import React from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import tw from "twrnc";

const AuthContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1 justify-center px-5 bg-gray-100 py-20`}
    >
      <View style={tw`bg-white p-6 rounded-lg shadow-lg`}>{children}</View>
    </KeyboardAvoidingView>
  );
};

export default AuthContainer;
