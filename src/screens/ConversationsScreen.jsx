import React, { useEffect, useState,memo } from "react";
import { View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { query, collection, where, onSnapshot, db } from "../../firebase";
import ConversationItem from "../components/Conversation/ConversationItem";
import { Context, useContext } from "../Context/ContextProvider";
import { theme } from "../theme";


const ConversationsScreen = () => {
  const { User, UserList, roomList, setRoomList } = useContext(Context);
  
  const [loading, setLoading] = useState(true);
  const q = query(collection(db, "rooms"), where("users", "array-contains", User.email));

  useEffect(() => {
    const getRoomList = onSnapshot(q, (snapshot) => {
      setRoomList(snapshot.docs.map((doc) => doc.data()));
      setLoading(false);
    });
    return () => getRoomList();
  }, []);

  return !loading ? (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <ScrollView style={{ paddingTop: 20 }}>
        {roomList
          ?.sort((a, b) => {
            return b?.lastupdate?.seconds - a?.lastupdate?.seconds;
          })
          .map((room) => {
            let friendEmail =
              room.users[0] !== User.email ? room.users[0] : room.users[1];
            let friendInfo = room[`${friendEmail}`];
            return (
              <ConversationItem
                key={room.id}
                id={room.id}
                time={room?.lastmessage?.time}
                lastMessage={room?.lastmessage}
                {...friendInfo}
              />
            );
          })}
      </ScrollView>
    </View>
  ) : (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
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

export default ConversationsScreen;
