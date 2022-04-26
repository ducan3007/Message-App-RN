import React, { useEffect } from "react";
import Loading from "../components/Loading/Loading";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import MessagesScreen from "../screens/MessagesScreen";
import HomeNavigator from "./HomeNavigator";
import Header from "../components/Header/Header";
import UserProfileScreen from "../screens/UserProfileScreen";
import { Context, useContext } from "../Context/ContextProvider";


const Stack = createStackNavigator();

const AppNavigator = () => {
  const { User, initAppLoading, } = useContext(Context);
 

  return (
    <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false }}>
      {User &&  (
        <>
          <Stack.Screen
            name="HomeScreen"
            component={HomeNavigator}
            options={{
              headerShown: true,
              header: () => <Header title="Messenger" />,
            }}
          />
          <Stack.Screen name="MessagesScreen" component={MessagesScreen} />
          <Stack.Screen
            options={{
              headerShown: true,
              title: "Me",
              headerTitleStyle: {
                color: theme.colors.primary,
              },
            }}
            name="UserProfileScreen"
            component={UserProfileScreen}
          />
        </>
      )}
      {!User && !initAppLoading && (
        <>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        </>
      )}
      {initAppLoading && (
        <>
          <Stack.Screen name="Loading" component={Loading} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
