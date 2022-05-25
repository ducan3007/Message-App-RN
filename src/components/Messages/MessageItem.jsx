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




const Message = ({ time, image, isLeft, content, onSwipe,setFullImg }) => {
  const startingPosition = 0;
  const x = useSharedValue(startingPosition);

  const isOnLeft = (type) => {
    if (isLeft && type === "messageContainer") {
      return {
        alignSelf: "flex-start",
        backgroundColor: "#E4E6EB",
        borderBottomLeftRadius: 0,
      };
    } else if (isLeft && type === "message") {
      return {
        color: "#050505",
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
        borderBottomRightRadius: 0,
      };
    }
  };

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {},
    onActive: (event, ctx) => {
      x.value = isLeft ? 50 : -50;
    },
    onEnd: (event, ctx) => {
      x.value = withSpring(startingPosition);
    },
  });

  const uas = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: x.value }],
    };
  });



  return (
    <FlingGestureHandler
      direction={isLeft ? Directions.RIGHT : Directions.LEFT}
      onGestureEvent={eventHandler}
    >
      <Animated.View style={[styles.container, uas]}>
        <View style={[styles.messageContainer, isOnLeft("messageContainer")]}>
          <View style={styles.messageView}>
            <Text style={[styles.message, isOnLeft("message")]}>{content}</Text>
            <TouchableOpacity
              onPress={()=>setFullImg(image)}
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
      </Animated.View>
    </FlingGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    marginVertical: 5,
  },
  messageContainer: {
    backgroundColor: theme.colors.messageBackground,
    maxWidth: "80%",
    alignSelf: "flex-end",
    flexDirection: "column",
    borderRadius: 15,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 5,
    elevation:1.5
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
    margin:0,
  },
  image: {
    resizeMode: "cover",
    width: "95%",
    alignSelf: "center",
    aspectRatio: 3/4,
    padding: 0,
    marginBottom: 0,
    borderRadius:7,
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
