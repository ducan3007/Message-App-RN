import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Dimensions } from "react-native";
import { storage, storeObjectData } from "../AsyncStorage";
import { Ionicons } from "@expo/vector-icons";
import logo_main from "../data/messenger_logo_2.png";
import { theme } from "../theme";

import { SafeAreaView } from "react-native-safe-area-context";
import { signIn, onAuthStateChanged, auth } from "../../firebase";
import { Context } from "../Context/ContextProvider";

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

const LoginScreen = ({ navigation }) => {
  const { User, setUser, resetState } = useContext(Context);
  const [email, setEmail] = useState("123@gmail.com");
  const [password, setPassword] = useState("123456");
  const [emailErrorMsg, setEmailErrorMsg] = useState(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState(null);

  useEffect(() => {
    const onAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUser(null);
      }
    });
    return () => onAuth();
  }, []);

  useEffect(() => {
    resetState();
  }, []);

  const handleSubmit = async () => {
    try {
      if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
        setEmailErrorMsg("Email is invalid!");
      } else if (!password) {
        setPasswordErrorMsg("Password is required!");
      } else {
        setEmailErrorMsg(null);
        setPasswordErrorMsg(null);

        const res = await signIn(email, password);

        const userdata = {
          id: res.user.uid,
          username: res.user.displayName,
          email: res.user.email,
          photoURL: res.user.photoURL,
          status: "online",
          callRole: "",
          callState: "offline",
          callRoom: "",
        };
        await storeObjectData("User", { ...userdata, password: password });
        setUser(userdata);
      }
    } catch (error) {
      console.log(error);
      if (error) {
        setPasswordErrorMsg("Invalid Email, Password !");
      }
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 25,
        backgroundColor: "white",
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: height / 10, marginLeft: 17, alignSelf: "center" }}>
          {/* <Image source={logo_main} style={{ width: width / 1.28, height: 80 }} /> */}
        </View>

        <Text
          style={{
            fontWeight: "bold",
            alignSelf: "center",
            fontSize: 25,
            color: "rgba(0, 95, 161,0.9)",
            marginTop: height / 10,
          }}
        >
          Login to your account
        </Text>

        <View style={{ marginTop: 0 }}>
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Ionicons name="mail-sharp" size={25} color={"rgba(0, 95, 161,0.9)"} />
            </View>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              selectionColor={"black"}
              placeholder="Email"
              style={styles.input}
            ></TextInput>
          </View>
          {emailErrorMsg && <Text style={{ color: theme.colors.error, paddingTop: 8 }}>{emailErrorMsg}</Text>}
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Ionicons name="lock-closed-sharp" size={25} color={"rgba(0, 95, 161,0.9)"} />
            </View>

            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
              selectionColor={"black"}
              placeholder="Password"
              style={styles.input}
            ></TextInput>
          </View>
          {passwordErrorMsg && <Text style={{ color: theme.colors.error, paddingTop: 8 }}>{passwordErrorMsg}</Text>}
          <TouchableOpacity onPress={handleSubmit}>
            <View style={styles.btnPrimary}>
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>LOGIN</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.signUp}>
            <Text style={styles.promptText}>Don't have an acount ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUpScreen")}>
              <Text style={styles.signUpText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  inputIcon: { marginTop: 0, position: "absolute" },
  input: {
    color: "#474747",
    paddingLeft: 35,
    borderBottomWidth: 1,
    borderColor: theme.light,
    borderBottomWidth: 0.5,
    flex: 1,
    fontSize: 16,
  },
  btnPrimary: {
    backgroundColor: "rgba(0, 95, 161,0.7)",
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  signUp: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginTop: 20,
  },
  signUpText: {
    color: theme.colors.pink,
    fontWeight: "bold",
  },
  promptText: {
    color: theme.colors.lightblue,
    fontWeight: "bold",
  },
});
