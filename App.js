import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { storeStringData, getStringData } from "./src/AsyncStorage";
import { NavigationContainer } from "@react-navigation/native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { LogBox, Button, Platform, AppState } from "react-native";
import { StyleSheet, SafeAreaView, ToastAndroid } from "react-native";
import { Context, useContext } from "./src/Context/ContextProvider";
import { db, doc, setDoc } from "./firebase";
import { ContextProvider } from "./src/Context/ContextProvider";
import AppContainer from "./src/AppContainer";
import { async } from "@firebase/util";

LogBox.ignoreLogs([
  "AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage",
]);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function Main() {
  const { navigationRef, setnotificationData } = useContext(Context);
  const appState = useRef(AppState.currentState);
  const notificationListener = useRef();
  const responseListener = useRef();

  const { User, setUser, setExpoPushToken } = useContext(Context);

  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const [notification, setNotification] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync().then(async (token) => {
      setExpoPushToken(token);
    });
  }, []);

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log("NOTIFICATION:", notification);
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      setnotificationData({
        userId: response.notification.request.content.data.id,
        id: response.notification.request.content.data.roomId,
        username: response.notification.request.content.data.username,
        email: response.notification.request.content.data.email,
        photoURL: response.notification.request.content.data.photoURL,
      });
    });
    return () => {
      console.log("REMOVE NOTIFICATIONS");
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  useEffect(() => {
    AppState?.addEventListener("change", _handleAppStateChange);
    return () => {
      AppState?.remove("change", _handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    const setAppState = async () => {
      if (User) {
        await setDoc(doc(db, "users", User.id), { appstate: appStateVisible }, { merge: true });
      }
    };
    setAppState();
  }, [appStateVisible]);

  const _handleAppStateChange = (nextAppState) => {
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <AppContainer />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ContextProvider>
        <Main />
      </ContextProvider>
    </SafeAreaView>
  );
}

const registerForPushNotificationsAsync = async () => {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        experienceId: "@anduc137/react_native_chat",
        applicationId: "com.anduc137.react_native_chat",
      })
    ).data;
  } else {
    ToastAndroid.show("Physical device is required for Push Notifications", ToastAndroid.LONG);
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("message", {
      name: "message",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      showBadge: true,
      sound: "notification.wav",
    });
  }
  return token;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
