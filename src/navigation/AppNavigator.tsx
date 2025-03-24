import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/auth/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
import { ProfileScreen } from "../screens/ProfileScreen";
import ReviewScreen from "../screens/review/ReviewScreen";
import { ResetPasswordForm } from "../screens/auth/FogotPasswordScreen";
import QuizDetailScreen from "../screens/QuizDetail";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Đăng nhập hệ thống">
          <Stack.Screen
            name="Đăng nhập hệ thống"
            component={LoginScreen}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="Quên mật khẩu"
            component={ResetPasswordForm}
            options={{ headerShown: true, gestureEnabled: false }}
          />
          <Stack.Screen
            name="Hệ thống thi trực tuyến"
            component={HomeScreen}
            options={{ headerShown: false, gestureEnabled: false }}
          />

          <Stack.Screen
            name="Làm bài kiểm tra"
            component={QuizDetailScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="Hồ sơ người dùng"
            component={ProfileScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="Xem lại bài kiểm tra"
            component={ReviewScreen}
            options={{ gestureEnabled: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
