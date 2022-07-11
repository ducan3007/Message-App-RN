import React, { useEffect } from "react";
import Loading from "../components/Loading/Loading";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import MessagesScreen from "../screens/MessagesScreen";
import HomeNavigator from "./HomeNavigator";
import Header from "../components/Header/Header";
import CallerScreen from "../screens/CallerScreen";
import CalleScreen from "../screens/CalleScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import { Context, useContext } from "../Context/ContextProvider";
import { unSubcribeSnapshot } from "../webrtc/webrtc";
import { onSnapshot, doc, db } from "../../firebase";
import { theme } from "../theme";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const {
    User,
    onSnapShotCalled,
    setOnSnapShotCalled,
    callState,
    setCallState,
    setCallRoom,
    setCaller,
    initAppLoading,
    navigationRef,
    notificationData,
    setnotificationData,
  } = useContext(Context);
  useEffect(() => {
    let unsubscribe;
    if (User && !onSnapShotCalled) {
      unsubscribe = onSnapshot(doc(db, "users", `${User.id}`), async (doc) => {
        try {
          if (doc.data().callState) {
            if (doc.data().callState === "offline") {
              await unSubcribeSnapshot();
            }
            setCallState(doc.data().callState);
          }
          if (doc.data().callRoom) {
            setCallRoom(doc.data().callRoom);
          }
          if (doc.data().caller) {
            setCaller(doc.data().caller);
          }
        } catch (error) {
          console.log(error);
        }
      });
      setOnSnapShotCalled(true);
    }
    return () => {
      if (unsubscribe) {
        console.log("UNSUB");
        unsubscribe();
      }
    };
  }, [User]);

  useEffect(() => {
    console.log("CHAY USE EFFECT");
    if (notificationData && User && callState !== "caller" && callState !== "callee") {
      console.log("NAVIGATION REF: ", navigationRef.current);
      navigationRef.current?.navigate("MessagesScreen", notificationData);
      setnotificationData();
    }
  }, [notificationData, User, callState, callState]);

  return (
    <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false }}>
      {User && callState === "caller" && (
        <>
          <Stack.Screen name="CallerScreen" component={CallerScreen}></Stack.Screen>
        </>
      )}
      {User && callState === "callee" && (
        <>
          <Stack.Screen name="CalleScreen" component={CalleScreen}></Stack.Screen>
        </>
      )}
      {User && callState !== "caller" && callState !== "callee" && (
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
