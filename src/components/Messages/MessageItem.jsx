import React, { memo } from "react";
import { View, Text, StyleSheet, Alert, Image, Dimensions } from "react-native";
import {
  FlingGestureHandler,
  Directions,
  State,
  TouchableOpacity,
} from "react-native-gesture-handler";
import moment from "moment";
import Animated, {
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useSharedValue,
} from "react-native-reanimated";

import { theme } from "../../theme";

const Message = ({
  index,
  messages,
  email,
  time,
  image,
  isLeft,
  content,
  onSwipe,
  setFullImg,
}) => {
  const startingPosition = 0;
  const x = useSharedValue(startingPosition);

  const isOnLeft = (type) => {
    if (isLeft && type === "messageContainer") {
      // if (messages[index + 1]?.email === email && messages[index - 1]?.email === email) {

      // }
      return {
        alignSelf: "flex-start",
        backgroundColor: "rgba(203, 206, 212,0.5)",
      };
    } else if (isLeft && type === "message") {
      return {
        color: "#1a1919",
      };
    } else if (isLeft && type === "timeView") {
      return {
        color: "black",
      };
    } else if (isLeft && type === "timeText") {
      return {
        marginLeft: -10,
        color: "black",
        alignSelf: "flex-start",
      };
    } else if (isLeft && type === "image") {
      return { alignSelf: "center" };
    } else if (!isLeft && type === "image") {
      return { alignSelf: "center" };
    } else {
      return {
        // borderBottomLeftRadius: 0,
      };
    }
  };

  const isContinuousMessage = () => {
    if (isLeft) {
      if (
        messages[index + 1]?.email !== messages[index]?.email &&
        messages[index - 1]?.email !== messages[index]?.email
      ) {
        return {
          paddingBottom: 2,
          marginBottom: 2,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 20,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 20,
        };
      }
      if (index === 0 || messages[index - 1]?.email !== messages[index]?.email) {
        return {
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 20,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          paddingBottom: 3,
          marginBottom: 3,
        };
      }
      if (
        messages[index + 1]?.email === messages[index]?.email &&
        messages[index - 1]?.email === messages[index]?.email
      ) {
        return {
          paddingBottom: 3,
          marginBottom: 3,
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 20,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 20,
        };
      } else if (messages[index]?.email !== messages[index + 1]?.email) {
        return {
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 20,
          marginBottom: 10,
        };
      }
    } else {
      if (
        messages[index + 1]?.email !== messages[index]?.email &&
        messages[index - 1]?.email !== messages[index]?.email
      ) {
        return {
          paddingBottom: 2,
          marginBottom: 2,
          borderBottomLeftRadius: 22,
          borderBottomRightRadius: 12,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 12,
        };
      }
      if (index === 0 || messages[index - 1]?.email !== messages[index]?.email) {
        return {
          borderBottomLeftRadius: 22,
          borderBottomRightRadius: 4,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          paddingBottom: 2,
          marginBottom: 2,
        };
      }
      if (
        messages[index + 1]?.email === messages[index]?.email &&
        messages[index - 1]?.email === messages[index]?.email
      ) {
        return {
          paddingBottom: 2,
          marginBottom: 2,
          borderBottomLeftRadius: 22,
          borderBottomRightRadius: 4,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 4,
        };
      } else if (messages[index]?.email !== messages[index + 1]?.email) {
        return {
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 22,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 4,
          marginBottom: 10,
        };
      }
    }
  };

  return (
    <View
      style={[
        styles.messageContainer,
        isContinuousMessage(),
        isOnLeft("messageContainer"),
      ]}
    >
      <View style={styles.messageView}>
        <Text style={[styles.message, isOnLeft("message")]}>{content}</Text>
        <TouchableOpacity
          onPress={() => setFullImg(image)}
          style={[styles.imagesContainer, isOnLeft("image")]}
        >
          {image !== "" && <Image style={styles.image} source={{ uri: image }} />}
        </TouchableOpacity>
      </View>
      <View style={[styles.timeView, isOnLeft("timeView")]}>
        <Text style={[styles.time, isOnLeft("timeText")]}>
          {moment(time.seconds * 1000).calendar()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  messageContainer: {
    // paddingVertical: 5,
    // marginVertical: 5,
    backgroundColor: "rgba(35, 97, 130,0.88)",
    maxWidth: "90%",
    alignSelf: "flex-end",
    flexDirection: "column",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  messageView: {
    backgroundColor: "transparent",
    maxWidth: "80%",
  },
  timeView: {
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    paddingLeft: 10,
    marginTop: 0,
  },
  imagesContainer: {
    padding: 0,
    margin: 0,
  },
  image: {
    resizeMode: "cover",
    width: "95%",
    alignSelf: "center",
    aspectRatio: 3 / 4,
    padding: 0,
    marginBottom: 0,
    borderRadius: 7,
  },
  message: {
    color: theme.colors.messageColor,
    alignSelf: "flex-start",
    fontSize: 18,
    lineHeight: 21,
  },
  time: {
    color: "#edebeb",
    alignSelf: "flex-end",
    fontSize: 8,
  },
});

export default memo(Message);
