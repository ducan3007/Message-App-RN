import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { doc, db, setDoc } from "../../firebase";
import ProfilePicture from "../components/Avatar/ProfilePicture";
import { Context, useContext } from "../Context/ContextProvider";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { RTCView } from "react-native-webrtc";

import { theme } from "../theme";

import { startLocalStream, startCall, unSubcribeSnapshot } from "../webrtc/webrtc";

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

const CallerScreen = () => {
  const { User, callRoom, callee, setCallee } = useContext(Context);

  const [start, setStart] = useState(false);

  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [cachedLocalPC, setCachedLocalPC] = useState();

  useEffect(() => {
    const startStreamAsync = async () => {
      try {
        await startLocalStream(setLocalStream);
      } catch (error) {
        console.log(error);
      }
    };
    startStreamAsync();
  }, []);

  const onStartCall = async () => {
   
    await startCall(
      callRoom,
      localStream,
      remoteStream,
      setRemoteStream,
      setCachedLocalPC
    );
    await setDoc(
      doc(db, "users", callee.id),
      {
        callState: "callee",
        callRoom: `${User.email}${callee.email}`,
        caller: {
          id: User.id,
          username: User.username,
          photoURL: User.photoURL,
        },
      },
      { merge: true }
    );
    setStart(true);
  };

  const backtoScreen = async () => {
    await setDoc(
      doc(db, "users", `${User.id}`),
      { callState: "offline", callRoom: "null" },
      { merge: true }
    );
  };

  const onHangUp = async () => {
    if (cachedLocalPC) {
      cachedLocalPC.removeStream(localStream);
      cachedLocalPC.close();
    }
    await unSubcribeSnapshot();

    setLocalStream();
    setRemoteStream();
    setCachedLocalPC();

    setCallee();

    await setDoc(
      doc(db, "users", `${User.id}`),
      { callState: "offline", callRoom: "null" },
      { merge: true }
    );
    await setDoc(doc(db, "users", callee.id), {
      callState: "offline",
      callRoom: "null",
      caller: {
        id: "",
        username: "",
        photoURL: "",
      },
    },{merge:true});
  };


  return (
    <View style={styles.container}>
      {start ? (
        <View style={{ flex: 1, justifyContent: "center", position: "relative" }}>
          <View style={styles.fullScreen}>
            {localStream && (
              <RTCView
                style={styles.rtc}
                streamURL={localStream && localStream.toURL()}
              />
            )}
          </View>
          <View style={styles.smallScreen}>
            {remoteStream && (
              <RTCView
                style={styles.rtc}
                streamURL={remoteStream && remoteStream.toURL()}
              />
            )}
          </View>

          <View style={styles.endCall}>
            <TouchableOpacity
              onPress={onHangUp}
              style={[
                styles.iconContainer,
                {
                  width: 60,
                  height: 60,
                  borderRadius: 60 / 2,
                  backgroundColor: theme.colors.error,
                },
              ]}
            >
              <MaterialCommunityIcons
                size={60 - 30}
                name={"phone-hangup"}
                color={"white"}
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View style={styles.profileContainer}>
            <ProfilePicture picture={callee?.photoURL} />
            <Text style={styles.calling}>{callee.username}</Text>
          </View>

          <View style={styles.backIcon}>
            <TouchableOpacity
              onPress={backtoScreen}
              style={[
                styles.iconContainer,
                {
                  width: 60,
                  height: 60,
                  borderRadius: 60 / 2,
                  backgroundColor: theme.colors.error,
                },
              ]}
            >
              <Ionicons size={60 - 30} name={"ios-arrow-back-sharp"} color={"white"} />
            </TouchableOpacity>
            <Text style={{alignSelf:'center',paddingTop:5,color:'white',fontSize:15}}>Back</Text>
          </View>

          <View style={styles.startCall}>
            <TouchableOpacity
              onPress={onStartCall}
              style={[
                styles.iconContainer,
                {
                  width: 60,
                  height: 60,
                  borderRadius: 60 / 2,
                  backgroundColor: theme.colors.success,
                },
              ]}
            >
              <MaterialCommunityIcons size={60 - 25} name={"phone"} color={"white"} />
            </TouchableOpacity>
            <Text style={{alignSelf:'center',paddingTop:5,color:'white',fontSize:15}}>Call</Text>
          </View>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#212121",
  },
  text: {
    alignSelf: "center",
  },
  profileContainer: {
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: height/2.5,
  },
  calling: {
    marginTop: 20,
    alignSelf: "center",
    color: "white",
    fontSize:23
  },
  fullScreen: {
    width: width,
    height: height,
    flex: 1,
  },
  smallScreen: {
    zIndex: 100,
    width: width / 2.6,
    height: height / 3.6,
    position: "absolute",
    top: 20,
    right: 5,
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 1,
    backgroundColor: "#212121",
  },
  rtc: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  iconContainer: {
    backgroundColor: "red",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    position: "absolute",
    left: width / 4,
    bottom: height / 5.5,
  },
  startCall: {
    position: "absolute",
    left: width / 1.6,
    bottom: height / 5.5,
  },
  endCall: {
    position: "absolute",
    left: width / 2.3,
    bottom: height / 16,
  },
});

export default CallerScreen;
