import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import QuizDetailScreen from "../screens/QuizDetail";
import { Provider } from "react-redux";
import store from "../../redux/store";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Đăng nhập hệ thống">
          <Stack.Screen
            name="Đăng nhập hệ thống"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Đăng kí hệ thống" component={RegisterScreen} />
          <Stack.Screen name="Hệ thống thi trực tuyến" component={HomeScreen} />
          <Stack.Screen name="Làm bài kiểm tra" component={QuizDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
