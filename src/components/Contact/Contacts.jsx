import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, ActivityIndicator, View } from "react-native";
import { db, getDocs, collection, onSnapshot, query } from "../../../firebase";
import { Context, useContext } from "../../Context/ContextProvider";
import ContactItem from "./ContactItem";
import { orderBy } from "firebase/firestore";

const Contacts = () => {
  const { User, UserList, setUserList } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const q = query(collection(db, "users"), orderBy("state", "desc"));

  useEffect(() => {
    const getRoomsAndUsers = async () => {
      try {
        const userLists = await getDocs(collection(db, "users"));
        setUserList(userLists.docs.map((doc) => doc.data()));
        setLoading(false);
      } catch (error) {
        console.log(
          "🚀 ~ file: HomeNavigator.jsx ~ line 151 ~ getRoomsAndUsers ~ error",
          error
        );
      }
    };
    getRoomsAndUsers();
  }, []);

  useEffect(() => {
    const getUserList = onSnapshot(q, (snapshot) => {
      setUserList(snapshot.docs.map((doc) => doc.data()));
    });

    return () => getUserList();
  }, []);

  return !loading ? (
    <ScrollView>
      {UserList?.filter((user) => {
        return user.email !== User.email;
      })?.map((user, index) => {
        if (user.username) {
          return (
            <ContactItem
              key={index}
              photoURL={user?.photoURL}
              username={user?.username}
              id={user?.id}
              email={user?.email}
              state={user?.state}
              appstate={user?.appstate}
            />
          );
        }
      })}
    </ScrollView>
  ) : (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" color="#0000ff" />
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
});

export default Contacts;
