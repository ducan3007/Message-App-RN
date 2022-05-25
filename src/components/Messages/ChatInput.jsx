import React, { useState, useContext } from "react";
import { View, StyleSheet, TextInput, Platform, TouchableOpacity, Image } from "react-native";

import { useSharedValue } from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import { Context } from "../../Context/ContextProvider";
import { addDoc, setDoc, doc, collection, db, updateLoadImageAsync } from "../../../firebase";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {Ionicons} from '@expo/vector-icons'
import EmojiPicker from "./emojis/EmojiPicker";

import { theme } from "../../theme";

const ChatInput = ({ id, pushToken, appstate, username }) => {
  const { User, permissionStatus, setPermissionStatus } = useContext(Context);

  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inputHeight, setInputHeight] = useState(60);
  const [imageURI, setImageURI] = useState(null);

  const messageRef = collection(db, "rooms", id, "messages");

  const addMessage = async (imgURL, message, email) => {
    try {
      const Payload = {
        image: imgURL,
        email: email,
        content: message,
        time: new Date(),
      };
      const lastmessage = {
        username: User.username,
        time: new Date(),
        text: imgURL ? "Sent you a photo" : message,
      };
      await Promise.all([
        addDoc(messageRef, Payload),
        setDoc(doc(db, "rooms", id), { lastmessage: lastmessage, lastupdate: new Date() }, { merge: true }),
        setDoc(doc(db, "users", User.id), { state: "online" }, { merge: true }),
      ]);

      if (appstate === "background") {
        const msg = {
          to: pushToken,
          title: username,
          body: imgURL ? "Đã gửi một ảnh" : "Tin nhắn mới: " + message,
          data: { someData: "data" },
          channelId: "message",
        };
        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(msg),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  // async function sendPushNotification(expoPushToken) {
  //   const message = {
  //     to: expoPushToken,
  //     title: "Tin nhắn mới",
  //     body: "And here is the body!",
  //     data: { someData: "goes here" },
  //     channelId: "message",
  //   };

  //   await fetch("https://exp.host/--/api/v2/push/send", {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Accept-encoding": "gzip, deflate",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(message),
  //   });
  // }

  const handleSend = async () => {
    let msg = message;
    let uri = imageURI;
    setMessage("");
    setInputHeight(60);
    setImageURI(null);
    if ((uri && message) || uri) {
      const url = await updateLoadImageAsync(uri);
      await addMessage(url, msg, User.email);
    } else if (message) {
      await addMessage("", msg, User.email);
    }
  };

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setImageURI(result.uri);
    }
  };

  // const handleImagePicker = () => {};

  const handleCamera = async () => {
    if (permissionStatus !== "granted") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setPermissionStatus(status);
    } else {
      const result = await ImagePicker.launchCameraAsync();
      if (!result.cancelled) {
        const url = await updateLoadImageAsync(result.uri);
        await addMessage(url, "", User.email);
      }
    }
  };

  const handleChangeText = (text) => {
    setMessage(text);
  };

  const handleContentSizeChange = (event) => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };

  // const handleChangeSize =()=> {
  //   if(showEmojiPicker) {

  //   }
  // };
  const deletePreviewImg = () => {
    setImageURI(null);
  };

  const handleInputHeight = () => {
    return {
      backgroundColor: "transparent",
      paddingLeft: 10,
      color: theme.colors.inputText,
      flex: 3,
      fontSize: 15,
      height: inputHeight,
      maxHeight: 300,
      minHeight: 60,
    };
  };

  return (
    <View style={[styles.container]}>
      {imageURI && (
        <View style={styles.PreviewContainer}>
          <Image source={{ uri: imageURI }} style={styles.imagePreview} />
          <TouchableOpacity onPress={deletePreviewImg} style={styles.deletePreviewImg}>
            <Icon name="close-circle" size={25} color={theme.colors.description} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.innerContainer}>
        <View style={styles.inputAndMicrophone}>
          <TouchableOpacity style={styles.emoticonButton} onPress={() => setShowEmojiPicker((value) => !value)}>
            <Icon name={showEmojiPicker ? "close" : "emoticon-outline"} size={25} color={theme.colors.description} />
          </TouchableOpacity>

          <TextInput
            multiline
            onContentSizeChange={handleContentSizeChange}
            placeholder={"Aa"}
            style={handleInputHeight()}
            value={message}
            onChangeText={(text) => handleChangeText(text)}
          />
          <TouchableOpacity onPress={handleImagePicker} style={styles.papperClip}>
            <Icon name="paperclip" size={25} color={theme.colors.description} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCamera} style={styles.cameraIcon}>
            <Icon name="camera" size={25} color={theme.colors.description} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Ionicons name="send" size={30} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      {showEmojiPicker && (
        <View style={{ height: 300 }}>
          <EmojiPicker setMessage={setMessage} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: "flex-end",
  },
  innerContainer: {
    paddingHorizontal: 0,
    marginHorizontal: 7,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 10,
  },
  inputAndMicrophone: {
    flexDirection: "row",
    backgroundColor: theme.colors.inputBackground,
    flex: 3,
    marginRight: 10,
    paddingVertical: Platform.OS === "ios" ? 10 : 0,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  cameraIcon: {
    paddingRight: 10,
    paddingLeft: 5,
    borderLeftWidth: 1,
    borderLeftColor: "#fff",
  },
  papperClip: {
    paddingRight: 5,
    paddingLeft: 5,
    borderLeftWidth: 1,
    borderLeftColor: "#fff",
  },

  emoticonButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
  },
  sendButton: {

    borderRadius: 50,
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePreview: {
    resizeMode: "contain",
    width: "60%",
    aspectRatio: 1 / 1,
    position: "relative",
    alignSelf: "center",
    bottom: 0,
  },
  PreviewContainer: {
    margin: 8,
  },
  deletePreviewImg: {
    position: "absolute",
    right: 5,
    top: 5,
  },
});

export default ChatInput;
