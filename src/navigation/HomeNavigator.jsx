import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { View, TouchableOpacity, Animated, Dimensions, StatusBar } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Ionicons } from "@expo/vector-icons";
import { doc, setDoc, db } from "../../firebase";
import ConversationsScreen from "../screens/ConversationsScreen";
import ContactScreen from "../screens/ContactScreen";
import { Context, useContext } from "../Context/ContextProvider";
import { theme } from "../theme";

const { width } = Dimensions.get("screen");

const TAB_ITEM_WIDTH = width / 2;

const Tab = createMaterialTopTabNavigator();

const TabBarIndicator = ({ state }) => {
  const [translateValue] = useState(new Animated.Value(TAB_ITEM_WIDTH));

  useEffect(() => {
    slide();
  }, [state]);

  const slide = () => {
    const toValue = TAB_ITEM_WIDTH + (state.index - 1) * TAB_ITEM_WIDTH;
    Animated.timing(translateValue, {
      toValue: toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: TAB_ITEM_WIDTH,
        borderBottomColor: "rgba(43,99,144,0.8)",
        borderBottomWidth: 2,
        borderRadius: 10,
        bottom: 0,
        transform: [{ translateX: translateValue }],
      }}
    />
  );
};

const MyTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        const isFocused = state.index === index;
        const tabBarItemWidth = TAB_ITEM_WIDTH;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({ name: route.name, merge: true });
          }
        };

    
        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={{
              width: tabBarItemWidth,
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 5,
              borderBottomColor: "gray",
              borderBottomWidth: 1,
              height: 40,
            }}
          >
            {route.name === "Calls" ? (
              <Animated.View>
                <Ionicons name="people" size={30} color="rgba(0, 95, 161,0.9)" />
              </Animated.View>
            ) : (
              <Animated.View>
                <Ionicons name="chatbox" size={28} color="rgba(0, 95, 161,0.9)" />
              </Animated.View>
            )}
          </TouchableOpacity>
        );
      })}
      <TabBarIndicator state={state} />
    </View>
  );
};

const HomeNavigator = () => {
  const { setPermissionStatus, setMediaPermission, ExpoPushToken, User } = useContext(Context);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setPermissionStatus(status);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setMediaPermission(status);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (ExpoPushToken) {
        await setDoc(doc(db, "users", User.id), { pushToken: ExpoPushToken }, { merge: true });
        console.log("sent push token");
      }
    })();
  }, []);

  return (
    <>
      <StatusBar style="light" backgroundColor={theme.colors.primary} />
      <Tab.Navigator
        initialRouteName="Conversations"
        tabBar={(props) => <MyTabBar {...props} />}
        style={{
          backgroundColor: "white",
        }}
      >
        <Tab.Screen name="Conversations" component={ConversationsScreen} />
        <Tab.Screen name="Calls" component={ContactScreen} />
      </Tab.Navigator>
    </>
  );
};

export default HomeNavigator;
