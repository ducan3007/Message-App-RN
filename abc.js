// import { Ionicons } from "@expo/vector-icons";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import AppLoading from "expo-app-loading";
// import * as Font from "expo-font";
// import * as Notifications from "expo-notifications";
// import React, { useEffect, useRef, useState } from "react";
// import { AsyncStorage } from "react-native";
// import { enableScreens } from "react-native-screens";
// import { Provider } from "react-redux";
// import configureStore from "./configureStore";
// import DrawerNavigation from "./navigation/DrawerNavigation";
// import rootReducer from "./rootReducer";
// import rootSaga from "./saga/saga";
// import PushNotificationsScreen from "./src/screens/PushNotificationsScreen";

// enableScreens();
// const store = configureStore(rootReducer, rootSaga);

// const Stack = createStackNavigator();

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// export default function App() {
//   const [isAppLoading, setIsAppLoading] = useState(false);
//   const [isFirstLaunch, setIsFirstLaunch] = useState(null);
//   const notificationListener = useRef();
//   const responseListener = useRef();
//   const navigationRef = useRef();

//   useEffect(() => {
//     // This listener is fired whenever a notification is received while the app is foregrounded
//     notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
//       // console.log(notification)
//     });

//     // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
//     responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
//       navigationRef.current?.navigate("Post", {
//         id: response.notification.request.content.data.id,
//       });
//     });

//     const fetchFonts = async () => {
//       try {
//         await Font.loadAsync({
//           Roboto: require("native-base/Fonts/Roboto.ttf"),
//           Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
//           ...Ionicons.font,
//         });
//       } catch (error) {
//         // console.log(error)
//         Sentry.Native.captureException(new Error(error));
//       }
//     };
//     fetchFonts();
//     setIsAppLoading(true);

//     // onboarding screen
//     AsyncStorage.getItem("alreadyLaunched").then((value) => {
//       if (value === null) {
//         AsyncStorage.setItem("alreadyLaunched", "true");
//         setIsFirstLaunch(true);
//       } else {
//         setIsFirstLaunch(false);
//       }
//     });

//     return () => {
//       Notifications.removeNotificationSubscription(notificationListener);
//       Notifications.removeNotificationSubscription(responseListener);
//     };
//   }, []);

//   if (!isAppLoading) {
//     return <AppLoading />;
//   }

//   if (isFirstLaunch === null) {
//     return null;
//   } else if (isFirstLaunch === true) {
//     return (
//       <Provider store={store}>
//         <NavigationContainer>
//           <Stack.Navigator
//             screenOptions={{
//               headerShown: false,
//             }}
//             initialRouteName="pushNotif"
//           >
//             <Stack.Screen name="myDrawer" component={DrawerNavigation} />
//             <Stack.Screen name="pushNotif" component={PushNotificationsScreen} />
//           </Stack.Navigator>
//         </NavigationContainer>
//       </Provider>
//     );
//   } else {
//     return (
//       <Provider store={store}>
//         <NavigationContainer ref={navigationRef}>
//           <Stack.Navigator
//             screenOptions={{
//               headerShown: false,
//             }}
//           >
//             <Stack.Screen name="myDrawer" component={DrawerNavigation} />
//           </Stack.Navigator>
//         </NavigationContainer>
//       </Provider>
//     );
//   }
// }
