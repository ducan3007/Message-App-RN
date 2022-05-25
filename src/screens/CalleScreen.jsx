import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { doc, db, collection } from "../../firebase";
import ProfilePicture from "../components/Avatar/ProfilePicture";
import { Context, useContext } from "../Context/ContextProvider";
import { MaterialCommunityIcons, FontAwesome, Entypo,Ionicons } from "@expo/vector-icons";
import { startLocalStream, joinCall, unSubcribeSnapshot } from "../webrtc/webrtc";
import { Dimensions } from "react-native";
import { RTCView } from "react-native-webrtc";
import { theme } from "../theme";
import { setDoc } from "../../firebase";

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

const CalleScreen = () => {
  const { User, callRoom, caller, setCaller } = useContext(Context);
  const [acceptCall, setAcceptCall] = useState(false);

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

  const AcceptCall = async () => {
    await joinCall(
      callRoom,
      localStream,
      remoteStream,
      setRemoteStream,
      setCachedLocalPC
    );
    setAcceptCall(true);
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

    await setDoc(
      doc(db, "users", `${User.id}`),
      {
        callState: "offline",
        callRoom: "null",
        caller: {
          username: "",
          photoURL: "",
        },
      },
      { merge: true }
    );
    await setDoc(
      doc(db, "users", caller.id),
      {
        callState: "offline",
        callRoom: "null",
        caller: {
          id: "",
          username: "",
          photoURL: "",
        },
      },
      { merge: true }
    );
    setCaller({});
  };

  const DeclineCall = async () => {
    await setDoc(
      doc(db, "users", `${User.id}`),
      {
        callState: "offline",
        callRoom: "null",
        caller: {
          id: "",
          username: "",
          photoURL: "",
        },
      },
      { merge: true }
    );

    await setDoc(
      doc(db, "users", caller.id),
      {
        callState: "offline",
        callRoom: "null",
        caller: {
          id: "",
          username: "",
          photoURL: "",
        },
      },
      { merge: true }
    );

    setCaller({});
  };

  return !acceptCall ? (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <ProfilePicture picture={caller?.photoURL} />
        <Text style={styles.calling}>{caller?.username}</Text>
      </View>
      <View style={styles.decline}>
        <TouchableOpacity
          onPress={DeclineCall}
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
          <Ionicons size={60 - 20} name={"close"} color={"white"} />
        </TouchableOpacity>
        <Text style={{alignSelf:'center',marginTop:10,color:'white',fontSize:15}} >Decline</Text>
      </View>

      <View style={styles.accept}>
        <TouchableOpacity
          onPress={AcceptCall}
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
          <Ionicons size={60 - 18} name={"checkmark-sharp"} color={"white"} />
        </TouchableOpacity>
        <Text style={{alignSelf:'center',marginTop:10,color:'white',fontSize:15}}>Accept</Text>
      </View>
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.fullScreen}>
        {localStream && (
          <RTCView style={styles.rtc} streamURL={localStream && localStream.toURL()} />
        )}
      </View>
      <View style={styles.smallScreen}>
        {remoteStream && (
          <RTCView style={styles.rtc} streamURL={remoteStream && remoteStream.toURL()} />
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
          <MaterialCommunityIcons size={60 - 15} name={"phone-hangup"} color={"white"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#212121",
  },
  profileContainer: {
    alignSelf: "center",
    paddingBottom: height/2.5,
  },
  calling: {
    marginTop: 20,
    alignSelf: "center",
    color: "white",
    fontSize:25
  },
  text: {
    alignSelf: "center",
  },
  fullScreen: {
    width: width,
    height: height,
    flex: 1,
  },
  smallScreen: {
    zIndex: 100,
    width: width / 2.6,
    height: height / 3.5,
    position: "absolute",
    top: 50,
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
  accept: {
    position: "absolute",
    bottom: 30,
    left: width / 2 + 50,
    bottom: height / 5,
  },
  decline: {
    position: "absolute",
    bottom: 30,
    left: width / 2 - 100,
    bottom: height / 5,
  },
  endCall: {
    position: "absolute",
    bottom: 30,
    left: width / 2.3,
    bottom: height / 17,
  },
});

export default CalleScreen;
