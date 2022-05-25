import React,{useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { signOut, auth, DisconnectBySignout,setDoc,db,doc } from "../../firebase";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Context, useContext } from "../Context/ContextProvider";
import { removeItem } from "../AsyncStorage";

import { theme } from "../theme";
const UserProfileScreen = ({ navigation }) => {
  const { User, setUser, setOnSnapShotCalled } = useContext(Context);
  const [image, setImage] = useState('')

  const handleLogOut = async () => {
    try {
      await removeItem("User");
      await DisconnectBySignout(auth.currentUser.uid);
      await setDoc(doc(db, "users", User.id), { appstate: 'active',pushToken:'' }, { merge: true });
      await signOut(auth);
      setUser(null);
      setOnSnapShotCalled(false);
    } catch (error) {}
  };

  const uploadProfile = async() => {
      
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{
            uri: `${User?.photoURL}`,
          }}
        />
      </TouchableOpacity>
      <Text style={styles.username}>{User?.username}</Text>
      <View style={{ paddingTop: 50 }}>
        <TouchableOpacity
          style={{ flexDirection: "row", justifyContent: "center", textAlign: "center" }}
          onPress={handleLogOut}
        >
          <MaterialIcons name="logout" size={35} color={theme.colors.pink} />
          <Text style={styles.logout}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "white",
  },
  imageContainer: {
    alignSelf: "center",
    borderRadius: 100,
    height: 150,
    width: 150,
    overflow: "hidden",
    elevation: 2,
  },
  image: {
    height: 150,
    width: 150,
  },
  username: {
    fontWeight: "900",
    fontSize: 25,
    alignSelf: "center",
    padding: 5,
    color: theme.colors.primary,
  },
  logout: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    textAlign: "center",
    color: theme.colors.pink,
  },
});

export default UserProfileScreen;
