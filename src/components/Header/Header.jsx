import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Context, useContext } from "../../Context/ContextProvider";
import logo from "../../data/messenger_logo_2.png";
import { theme } from "../../theme";

const width = Dimensions.get("screen").width;

const Header = ({ title }) => {
  const navigation = useNavigation();
  const { User } = useContext(Context);
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={logo}
          style={{
            width: width / 2.15,
            aspectRatio: 3.84 / 1,
            marginLeft: 10,
            marginTop: 10,
          }}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("UserProfileScreen");
          }}
          style={styles.imageContainer}
        >
          <Image
            style={styles.image}
            source={{
              uri: `${User.photoURL}`,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor:'white',
    paddingBottom: 30,
  },
  headerContainer: {
    flexDirection: "row",
    position: "relative",
    justifyContent: "space-between",
    paddingTop: 8,
  },
  imageContainer: {
    borderRadius: 30,
    height: 45,
    width: 45,
    overflow: "hidden",
    marginTop: 0,
    borderWidth: 1,
    borderColor: "#E4E4E4",
    marginRight:15,
    marginTop:8
  },
  image: {
    height: 44,
    width: 44,
    borderColor: "black",
  },
});

export default Header;
