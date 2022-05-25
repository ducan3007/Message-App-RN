import React, { useState, useRef, useEffect, memo } from "react";
import { View, ScrollView, ActivityIndicator, StyleSheet, Image, TouchableOpacity, Dimensions, Modal, ToastAndroid, } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { dowloadFileAsync } from "../../utils/utils";
import ChatHeader from "../components/Messages/ChatHeader";
import ChatInput from "../components/Messages/ChatInput";
import { Context, useContext } from "../Context/ContextProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Message from "../components/Messages/MessageItem";
import { db, onSnapshot, where, query, getDoc, doc } from "../../firebase";
import { theme } from "../theme";
import { collection, orderBy } from "firebase/firestore";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const MessagesScreen = ({ navigation, route }) => {
  const { User, Messages, setMessages, mediaPermission, setMediaPermission } = useContext(Context);
  const { username, id, photoURL, email, state, userId } = route.params;
  const [pushToken, setPushToken] = useState("");
  const [appstate, setAppState] = useState("active");
  const [loading, setLoading] = useState(true);
  const [onlineState, setOnlineState] = useState(state);
  const scrollView = useRef();

  const [modal, setModal] = useState(null);

  const stateQuery = query(collection(db, "users"), where("email", "==", email));
  const messageRef = query(collection(db, "rooms", id, "messages"), orderBy("time"));

  useEffect(() => {
    const getOnlineStatus = onSnapshot(stateQuery, (snapshot) => {
      const userSnap = snapshot.docs.map((doc)=>doc.data())
      setOnlineState(userSnap[0].state);
      setAppState(userSnap[0]?.appstate);
      setPushToken(userSnap[0]?.pushToken);
    });

    return () => getOnlineStatus();
  }, []);

  

  useEffect(() => {
    const getMessages = onSnapshot(messageRef, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
      setLoading(false);
    });

    return () => getMessages();
  }, []);

  const onCloseModal = () => {
    setModal(null);
  };

  const downloadImage = async () => {
    if (mediaPermission !== "granted") {
      const permission = await MediaLibrary.getPermissionsAsync();

      const { status } = await MediaLibrary.requestPermissionsAsync(false);

      setMediaPermission(status);
    }

    let uri = modal;
    let downloadSuccess = false;
    setModal(null);
    ToastAndroid.show("Downloading...", ToastAndroid.LONG);
    await dowloadFileAsync(uri, downloadSuccess);
  };


  return (
    <View style={{ flex: 1 }}>
      <ChatHeader email={email} username={username} photoURL={photoURL} onlineStatus={onlineState} />

      {!loading ? (
        <ScrollView
          style={{ backgroundColor: theme.colors.white, flex: 1 }}
          ref={(ref) => (scrollView.current = ref)}
          onContentSizeChange={() => {
            scrollView.current.scrollToEnd({ animated: true });
          }}
        >
          {Messages?.map((message, index) => (
            <Message
              key={index}
              time={message.time}
              isLeft={message.email !== User.email}
              image={message?.image}
              content={message.content}
              setFullImg={setModal}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}

      <ChatInput id={id} username={User.username} appstate={appstate} pushToken={pushToken} />
      {modal && (
        <Modal animationType="slide" transparent visible={modal !== null}>
          <View style={styles.fullImageView}>
            <Image style={styles.image} source={{ uri: modal }} />
            <TouchableOpacity onPress={onCloseModal} style={styles.close}>
              <MaterialCommunityIcons name="close" size={35} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={downloadImage} style={styles.downloadImage}>
              <MaterialCommunityIcons name="download" size={35} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  fullImageView: {
    position: "absolute",
    top: height * 0.02,
    bottom: height * 0,
    left: width * 0.05,
    right: width * 0.05,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    width: width * 0.9,
    height: height * 0.95,
    backgroundColor: theme.colors.inputBackground,
    elevation: 5,
    borderRadius: 15,
  },
  image: {
    resizeMode: "contain",
    width: "95%",
    height: "95%",
    alignSelf: "center",
    marginBottom: -10,
  },
  close: {
    position: "absolute",
    top: 1,
    right: 5,
  },
  downloadImage: {
    position: "absolute",
    top: 1,
    right: 50,
  },
});

export default memo(MessagesScreen);
