import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getRandomHexString } from "../../utils/utils";
import { useContext } from "react";
import { theme } from "../theme";
import { signUp, updateProfile, doc, db } from "../../firebase";
import { Context } from "../Context/ContextProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { setDoc } from "firebase/firestore";

const LoginScreen = ({ navigation }) => {
  const { User, setUser, setOnSnapShotCalled } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState({});

  const handleSubmit = async () => {
    try {
      const idAvatar = getRandomHexString(16);
      if (!username) {
        setError({ ...error, name: "Name is required!" });
      } else if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
        setError({ ...error, name: null, email: "Email is invalid!" });
      } else if (password.length < 6) {
        setError({
          ...error,
          name: null,
          email: null,
          password: "Password must be at least 6 char",
        });
      } else if (password !== confirmPassword) {
        setError({
          ...error,
          name: null,
          email: null,
          password: null,
          confirm: "Passwords don't match!",
        });
      } else {
        setError({});
        const res = await signUp(email, password);

        await updateProfile(res.user, {
          displayName: username,
          photoURL: `https://secure.gravatar.com/avatar/${idAvatar}?s=164&d=identicon`,
        });

        await setDoc(doc(db, "users", res.user.uid), {
          id: res.user.uid,
          username: res.user.displayName,
          email: res.user.email,
          photoURL: `https://secure.gravatar.com/avatar/${idAvatar}?s=164&d=identicon`,
         
        });

        const userdata = {
          id: res.user.uid,
          username: res.user.displayName,
          email: res.user.email,
          photoURL: `https://secure.gravatar.com/avatar/${idAvatar}?s=164&d=identicon`,
          state: "online",
         
        };
      
        setUser(userdata);
    
      }
    } catch (error) {
      console.log(error);
      setError({ ...error, name: null, confirm: "Signup error, please try again!" });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 115, backgroundColor: theme.white }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text
          style={{
            fontWeight: "bold",
            alignSelf: "center",
            fontSize: 24,
            color: "rgba(0, 95, 161,0.9)",
          }}
        >
          Create your account
        </Text>

        <View style={{ marginTop: 20 }}>
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Ionicons name="person-sharp" size={25} color={"rgba(0, 95, 161,0.9)"} />
            </View>
            <TextInput
              value={username}
              onChangeText={(text) => setUsername(text)}
              selectionColor={"black"}
              placeholder="Name"
              style={styles.input}
            ></TextInput>
          </View>
          {error?.name && <Text style={{ color: theme.colors.error }}>{error?.name}</Text>}

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
          {error?.email && <Text style={{ color: theme.colors.error }}>{error?.email}</Text>}
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
          {error?.password && <Text style={{ color: theme.colors.error }}>{error?.password}</Text>}
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Ionicons name="key-sharp" size={25} color={"rgba(0, 95, 161,0.9)"} />
            </View>

            <TextInput
              value={confirmPassword}
              onChangeText={(text) => setconfirmPassword(text)}
              secureTextEntry
              selectionColor={"black"}
              placeholder="Confirm Password"
              style={styles.input}
            ></TextInput>
          </View>
          {error?.confirm && <Text style={{ color: theme.colors.error }}>{error?.confirm}</Text>}
          <TouchableOpacity onPress={handleSubmit}>
            <View style={styles.btnPrimary}>
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>SIGN UP</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.signUp}>
            <Text style={styles.promptText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
              <Text style={styles.signUpText}>Log in</Text>
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
    marginTop: 40,
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
