import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "@expo/vector-icons/FontAwesome";
import { FontAwesome5 } from '@expo/vector-icons'; 
import { doc, db, collection, getUserID, setDoc } from "../../../firebase";
import { Context, useContext } from "../../Context/ContextProvider";
import { theme } from "../../theme";

const ChatHeader = ({ username, email, photoURL, onlineStatus, onPress }) => {
  const navigation = useNavigation();
  const { User, setCallee } = useContext(Context);

  const startCall = async () => {
    const userId = await getUserID(email);
    const callerRef = doc(db, "users", User.id);
    setCallee({ id: userId, email: email, username: username, photoURL: photoURL });
    await setDoc(
      callerRef,
      { callState: "caller", callRoom: `${User.email}${email}` },
      { merge: true }
    );
  };
  const onBackScreen = () => {
    navigation.navigate('HomeScreen')
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Icon
          name="angle-left"
          size={40}
          onPress={onBackScreen}
          color={theme.colors.primary}
        />
      </TouchableOpacity>
      <View style={styles.profileOptions}>
        <TouchableOpacity style={styles.profile}>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: photoURL }} />
            {onlineStatus === "online" && (
              <View style={[styles.activity, styles.status]} />
            )}
          </View>
          <View style={styles.usernameAndOnlineStatus}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.onlineStatus}>{onlineStatus}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.options}>
          <TouchableOpacity onPress={startCall} style={{ paddingHorizontal: 15 }}>
            <FontAwesome5 name="video" size={30} color={theme.colors.pink} />
          </TouchableOpacity>
          <TouchableOpacity style={{ paddingHorizontal: 5 }}>
            <Icon name="ellipsis-v" size={30} color={theme.colors.messageBackground} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: theme.colors.white,
    paddingBottom: 5,
    elevation:7
  },
  backButton: {
    alignSelf: "center",
    paddingHorizontal: 10,
  },
  profileOptions: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "red",
    marginTop:2,
    flex: 4,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 35,
    borderColor: '#edfcfc',
    borderWidth: 1,
  },
  usernameAndOnlineStatus: {
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  username: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  onlineStatus: {
    color: theme.colors.primary,
    fontSize: 12,
    fontStyle: 'italic'
  },
  options: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop:6,
  },
  imageContainer: {
    borderRadius: 25,
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    
  },
  activity: {
    backgroundColor: "#27AE60",
    position: "absolute",
    alignSelf: "flex-end",
    borderColor: "white",
    borderWidth: 2,
   
  },
  status: {
    width: 15,
    height: 15,
    borderRadius: 15,
    bottom: -1,
    right: 1,
  },
});

export default ChatHeader;
