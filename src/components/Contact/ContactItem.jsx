import React, { useState,memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Context, useContext } from "../../Context/ContextProvider";
import { Ionicons, Fontisto } from "@expo/vector-icons";
import { theme } from "../../theme";
import { db, doc, setDoc, getDoc } from "../../../firebase";

const ContactItem = ({ username, photoURL, id, email, state,appstate }) => {
    const { User, setCallee } = useContext(Context);
  
    const navigation = useNavigation();
  
    const createRoomChat = async () => {
      
    };
    const startCall = async () => {
     
    };
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: photoURL }} />
          {state === "online" && <View style={[styles.activity, styles.status]} />}
        </View>
  
        <View style={styles.usernameAndCall}>
          <View style={styles.usernameAndStatus}>
            <Text style={styles.username}>{username}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={createRoomChat} style={{ alignSelf: "center", paddingRight: 30 }}>
              <Ionicons name="chatbox" size={28} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={startCall} style={{ alignSelf: "center" }}>
              <Fontisto name="phone" size={25} color={theme.colors.pink} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      paddingTop: 25,
      paddingRight: 20,
      paddingLeft: 10,
      flexDirection: "row",
    },
    imageContainer: {
      borderRadius: 25,
      height: 50,
      width: 50,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    image: {
      height: 50,
      width: 50,
      borderRadius: 25,
      borderColor: "#edfcfc",
      borderWidth: 1,
    },
    usernameAndCall: {
      flexDirection: "row",
      justifyContent: "space-between",
      flex: 1,
      alignItems: "center",
    },
    usernameAndStatus: {
      paddingHorizontal: 13,
      marginTop: -5,
    },
    username: {
      color: "rgba(0, 95, 161,0.9)",
      fontSize: theme.fontSize.title,
      fontWeight: "bold",
    },
  
    iconStyle: {
      alignSelf: "center",
    },
    time: {
      color: theme.colors.description,
      paddingHorizontal: 5,
    },
    activity: {
      backgroundColor: "#27AE60",
      position: "absolute",
      alignSelf: "flex-end",
      borderColor: "white",
      borderWidth: 2,
    },
    status: {
      width: 20,
      height: 20,
      borderRadius: 15,
      bottom: -1,
      right: 1,
    },
  });
  
  export default memo(ContactItem);

