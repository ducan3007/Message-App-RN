import React, { useState, useEffect,memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { getUserID } from "../../../firebase";
import { Context, useContext } from "../../Context/ContextProvider";
import { theme } from "../../theme";
const width = Dimensions.get("screen").width;

const ConversationItem = ({ id, username, time, photoURL, lastMessage, email }) => {
  const { User, UserList, getUserOnlineState, getUserAppState } = useContext(Context);
  const [state, setState] = useState(getUserOnlineState(email));
  const [appstate, setappstate] = useState(getUserAppState(email));
  const [userId, setUserId] = useState(getUserAppState(email));
  const navigation = useNavigation();

  useEffect(() => {
    setState(getUserOnlineState(email));
    setappstate(getUserAppState(email));
  }, [UserList]);

  useEffect(() => {
    const def = async () => {
      const userId = await getUserID(email);
      setUserId(userId);
    };
    def();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.conversation}
        onPress={() =>
          navigation.navigate("MessagesScreen", {
            id: id,
            userId:userId,
            username: username,
            email: email,
            photoURL: photoURL,
            state: state,
            appstate: appstate,
          })
        }
      >
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: photoURL }} />
          {state === "online" && (
            <View
              style={[
                {
                  backgroundColor: "#27AE60",
                  position: "absolute",
                  alignSelf: "flex-end",
                  borderColor: "white",
                  borderWidth: 2,
                },
                {
                  width: 20,
                  height: 20,
                  borderRadius: 15,
                  bottom: -5,
                  right: 1,
                },
              ]}
            />
          )}
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text numerOfLine={1} style={styles.username}>
              {username}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            <Text numberOfLines={1} style={styles.message}>
              {!lastMessage?.text
                ? ""
                : lastMessage?.username === User.username
                ? "You" + ": " + lastMessage?.text
                : lastMessage?.username + ": " + lastMessage?.text}
            </Text>
            <Text style={styles.time}>
              {!lastMessage?.time ? "" : moment(lastMessage?.time?.seconds * 1000).calendar()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  conversation: {
    flexDirection: "row",
    paddingBottom: 25,
    paddingRight: 0,
    paddingLeft: 10,
  },
  imageContainer: {
    marginRight: 15,
    borderRadius: 25,
    height: 50,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    flexDirection: "row",
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: 60,
    borderColor: "#edfcfc",
    borderWidth: 1,
  },
  username: {
    fontSize: theme.fontSize.title,
    color: "rgba(0, 95, 161,0.9)",
    fontWeight: "bold",
    width: 210,
  },
  message: {
    fontSize: 14,
    color: theme.colors.subTitle,
    width: width / 1.5,
  },
  time: {
    fontSize: 14,
    color: theme.colors.subTitle,
    fontWeight: "normal",
  },
});

export default memo(ConversationItem);
