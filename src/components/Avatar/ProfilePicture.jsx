import React from "react";
import { View, Image, StyleSheet } from "react-native";

const ProfilePicture = ({ picture }) => {
  let uriImage = "https://secure.gravatar.com/avatar/?s=70&d=mp";
  if (picture) {
    uriImage = picture;
  }
  return (
    <View>
      <Image style={styles.image} source={{ uri: uriImage }} />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 150,
    width: 150,
    borderRadius: 100,
  },
});

export default ProfilePicture;
