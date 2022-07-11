import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import {
  signOut,
  auth,
  DisconnectBySignout,
  setDoc,
  db,
  doc,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "../../firebase";
import {
  MaterialIcons,
  Feather,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { updateLoadImageAsync } from "../../firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Context, useContext } from "../Context/ContextProvider";
import { removeItem } from "../AsyncStorage";

import { theme } from "../theme";
import { async } from "@firebase/util";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const UserProfileScreen = ({ navigation }) => {
  const { User, setUser, setOnSnapShotCalled } = useContext(Context);
  const [newImageURI, setNewImageURI] = useState(null);
  const [editNameModal, setEditNameModal] = useState(null);
  const [changePasswordModal, setChangePasswordModal] = useState(null);
  const [image, setImage] = useState("");

  useEffect(() => {
    if (User) {
      setImage(User.photoURL);
    }
  }, []);

  const handleLogOut = async () => {
    try {
      await removeItem("User");
      await DisconnectBySignout(auth.currentUser.uid);
      await setDoc(
        doc(db, "users", User.id),
        { appstate: "active", pushToken: "" },
        { merge: true }
      );
      await signOut(auth);
      setUser(null);
      setOnSnapShotCalled(false);
    } catch (error) {}
  };

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setNewImageURI(result.uri);
      setImage(result.uri);
    }
  };
  const uploadProfile = async () => {
    if (newImageURI) {
      const response = await updateLoadImageAsync(newImageURI);
      if (response) {
        const data = await setDoc(
          doc(db, "users", User.id),
          { photoURL: response },
          { merge: true }
        );
        const user = auth.currentUser;
        await updateProfile(auth.currentUser, { photoURL: response });
        setUser({ ...User, photoURL: response });
        setNewImageURI(null);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={
              image
                ? {
                    uri: image,
                  }
                : null
            }
          />
        </View>
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 0,
            right: 5,
            zIndex: 5555,
            alignSelf: "center",
            padding: 9,
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={handleImagePicker}
        >
          <FontAwesome name="camera" size={24} color="black" />
        </TouchableOpacity>
        <View style={{ paddingTop: 15 }}>
          <Text style={styles.user_info}>{User?.username}</Text>
          <Text style={styles.user_info}>{User?.email}</Text>
        </View>
        {newImageURI && (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setNewImageURI(null);
                setImage(User?.photoURL);
              }}
              style={{
                padding: 6,
                marginRight: 5,
                borderRadius: 5,
                backgroundColor: theme.colors.error,
              }}
            >
              <Text style={{ color: "white" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={uploadProfile}
              style={{
                padding: 6,
                backgroundColor: theme.colors.primary,
                marginRight: 5,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "white" }}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View
        style={{
          paddingTop: 35,
          borderBottomColor: "rgba(36, 79, 112,0.7)",
          borderBottomWidth: 1,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setEditNameModal(true);
          }}
          style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
        >
          <Feather name="edit-3" size={24} color={theme.colors.primary} />
          <Text style={styles.edit}>Edit Name</Text>
        </TouchableOpacity>
      </View>
      <View style={{ borderBottomColor: "rgba(36, 79, 112,0.7)", borderBottomWidth: 1 }}>
        <TouchableOpacity
          onPress={() => setChangePasswordModal(true)}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
          }}
        >
          <MaterialCommunityIcons
            name="onepassword"
            size={24}
            color={theme.colors.primary}
          />
          <Text style={styles.edit}>Change Password</Text>
        </TouchableOpacity>
      </View>

      <View style={{ borderBottomColor: "rgba(36, 79, 112,0.7)", borderBottomWidth: 1 }}>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
          onPress={handleLogOut}
        >
          <MaterialIcons name="logout" size={27} color={theme.colors.pink} />
          <Text style={styles.logout}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      {editNameModal && (
        <NameModel
          User={User}
          setUser={setUser}
          open={editNameModal}
          setOpen={setEditNameModal}
        />
      )}
      {changePasswordModal && (
        <ChangePasswordModal
          User={User}
          open={changePasswordModal}
          setOpen={setChangePasswordModal}
        />
      )}
    </SafeAreaView>
  );
};

const NameModel = ({ open, setOpen, setUser, User }) => {
  const [name, setname] = useState("");

  const onSave = async () => {
    if (name !== "") {
      const data = await updateProfile(auth.currentUser, { displayName: name });
      await setDoc(doc(db, "users", User.id), { username: name }, { merge: true });

      console.log("NEW DATA", data);
      setUser((prev) => ({ ...prev, username: name }));
      setOpen(false);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={open !== null}>
      <View style={styles.modal_view}>
        <TouchableOpacity onPress={() => setOpen(null)} style={styles.close}>
          <MaterialCommunityIcons name="close" size={35} color={theme.colors.primary} />
        </TouchableOpacity>
        <View style={{ height: 40 }}>
          <TextInput
            value={name}
            onChangeText={(text) => setname(text)}
            placeholder="Enter your name"
            style={styles.input}
          ></TextInput>
        </View>

        <View
          style={{
            paddingTop: 10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setname("");
              setOpen(null);
            }}
            style={{
              padding: 6,
              marginRight: 5,
              borderRadius: 5,
              backgroundColor: theme.colors.error,
            }}
          >
            <Text style={{ color: "white" }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSave}
            style={{
              padding: 6,
              marginRight: 5,
              borderRadius: 5,
              backgroundColor: theme.colors.primary,
            }}
          >
            <Text style={{ color: "white" }}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const ChangePasswordModal = ({ User, open, setOpen }) => {
  const [error, setError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePassword = async () => {
    if (currentPassword === "" || newPassword === "" || confirmPassword === "") {
      return setError("Please fill all the fields");
    }
    if (newPassword !== confirmPassword) {
      return setError("New password and confirm password does not match");
    }

    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );
    const result = await reauthenticateWithCredential(auth.currentUser, credential).catch(
      (err) => {
        return setError("Current password is incorrect");
      }
    );
    if (result !== undefined) {
      const data = await updatePassword(auth.currentUser, newPassword);
      setOpen(false);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={open !== null}>
      <View style={styles.modal_view}>
        <TouchableOpacity onPress={() => setOpen(null)} style={styles.close}>
          <MaterialCommunityIcons name="close" size={35} color={theme.colors.primary} />
        </TouchableOpacity>
        <View style={{ height: 40, paddingTop: 5 }}>
          <TextInput
            secureTextEntry
            value={currentPassword}
            onChangeText={(text) => setCurrentPassword(text)}
            placeholder="Current Password"
            style={styles.input}
          />
        </View>
        <View style={{ height: 40, paddingTop: 5 }}>
          <TextInput
            secureTextEntry
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
            placeholder="New Password"
            style={styles.input}
          />
        </View>
        <View style={{ height: 40, paddingTop: 5 }}>
          <TextInput
            secureTextEntry
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            placeholder="Confirm Password"
            style={styles.input}
          />
        </View>
        {error !== "" && (
          <View>
            <Text style={{ color: theme.colors.error }}>{error}</Text>
          </View>
        )}

        <View
          style={{
            paddingTop: 10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setCurrentPassword("");
              setNewPassword("");
              setConfirmPassword("");
              setOpen(null);
            }}
            style={{
              padding: 6,
              marginRight: 5,
              borderRadius: 5,
              backgroundColor: theme.colors.error,
            }}
          >
            <Text style={{ color: "white" }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={changePassword}
            style={{
              padding: 6,
              marginRight: 5,
              borderRadius: 5,
              backgroundColor: theme.colors.primary,
            }}
          >
            <Text style={{ color: "white" }}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "white",
  },
  imageContainer: {
    alignSelf: "center",
    borderRadius: 100,
    height: 130,
    width: 130,
    overflow: "hidden",
    elevation: 2,
  },
  image: {
    height: 150,
    width: 150,
  },
  camera: {
    alignSelf: "center",
  },
  user_info: {
    fontWeight: "900",
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    padding: 0,
    color: theme.colors.primary,
  },
  logout: {
    fontSize: 15,
    fontWeight: "bold",
    alignSelf: "center",
    textAlign: "center",
    color: theme.colors.pink,
    paddingLeft: 10,
  },
  edit: {
    fontSize: 15,
    fontWeight: "bold",
    color: theme.colors.primary,
    paddingLeft: 10,
  },
  btn: {
    backgroundColor: "red",
  },
  modal_view: {
    position: "absolute",
    top: height * 0.25,
    bottom: height * 0,
    left: width * 0.05,
    right: width * 0.05,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    width: width * 0.9,
    height: height * 0.4,
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 15,
  },
  close: {
    position: "absolute",
    top: 1,
    right: 5,
  },
  input: {
    height: "100%",
    width: width * 0.8,
    color: "#474747",
    borderWidth: 2,
    borderColor: theme.colors.primary,
    flex: 1,
    fontSize: 12,
    padding: 4,
    borderRadius: 5,
  },
});

export default UserProfileScreen;
