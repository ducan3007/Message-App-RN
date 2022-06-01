import React, { createContext, useState, useRef, useContext, useLayoutEffect } from "react";
import { signIn } from "../../firebase";
import { getObjectData } from "../AsyncStorage";
const Context = createContext();

const ContextProvider = ({ children }) => {
  const [Messages, setMessages] = useState([]);
  const [UserList, setUserList] = useState();
  const [ExpoPushToken, setExpoPushToken] = useState("");
  const [roomList, setRoomList] = useState();
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [mediaPermission, setMediaPermission] = useState(null);
  const [User, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [notificationData, setnotificationData] = useState(null);

  const [initAppLoading, setinitAppLoading] = useState(true);

  const navigationRef = useRef();

  useLayoutEffect(() => {
    const getUserFromStorage = async () => {
      try {
        const user = await getObjectData("User");
        if (user) {
          await signIn(user.email, user.password);
        }
        setUser(user);
        setinitAppLoading(false);
      } catch (error) {
        console.log(error);
        setUser(null);
        setinitAppLoading(false);
      }
    };
    getUserFromStorage();
  }, []);

  const [onSnapShotCalled, setOnSnapShotCalled] = useState(false);

  const [callRoom, setCallRoom] = useState(null);
  const [callState, setCallState] = useState("offline");

  const [caller, setCaller] = useState({});
  const [callee, setCallee] = useState({});

  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [cachedLocalDevice, setCachedLocalDevice] = useState();

  const getUserOnlineState = (email) => {
    const user = UserList?.filter((user) => user.email === email);
    if (!user) {
      return;
    }
    if (user[0]?.state) {
      return user[0]?.state;
    } else {
      return "offline";
    }
  };
  const getUserAppState = (email) => {
    const user = UserList?.filter((user) => user.email === email);
    if (!user) {
      return;
    }
    if (user[0]?.appstate) {
      return user[0]?.appstate;
    } else {
      return "background";
    }
  };

  const resetState = () => {
    setUserList();
    setRoomList();
  };
  const props = {
    Messages,
    setMessages,
    User,
    setUser,
    UserList,
    setUserList,
    roomList,
    setRoomList,
    permissionStatus,
    setPermissionStatus,
    localStream,
    setLocalStream,
    remoteStream,
    setRemoteStream,
    cachedLocalDevice,
    setCachedLocalDevice,
    callState,
    setCallState,
    callRoom,
    setCallRoom,
    caller,
    setCaller,
    callee,
    setCallee,
    onSnapShotCalled,
    setOnSnapShotCalled,
    mediaPermission,
    setMediaPermission,
    initAppLoading,
    setLoading,
    ExpoPushToken,
    setExpoPushToken,
    navigationRef,
    loading,
    notificationData,
    setnotificationData,
    resetState,
    getUserOnlineState,
    getUserAppState,
  };
  return <Context.Provider value={props}>{children}</Context.Provider>;
};

export { Context, ContextProvider, useContext };
