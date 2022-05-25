import React, { createContext, useState, useContext, useLayoutEffect } from "react";
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
  const [initAppLoading, setinitAppLoading] = useState(true);

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
    User,
    UserList,
    roomList,
    permissionStatus,
    localStream,
    remoteStream,
    cachedLocalDevice,
    callState,
    callRoom,
    caller,
    callee,
    onSnapShotCalled,
    mediaPermission,
    initAppLoading,
    ExpoPushToken,
    setExpoPushToken,
    setMediaPermission,
    setOnSnapShotCalled,
    setCallee,
    setCaller,
    setCallRoom,
    setCallState,
    setCachedLocalDevice,
    setLocalStream,
    setRemoteStream,
    setRoomList,
    setUserList,
    setMessages,
    setUser,
    resetState,
    getUserOnlineState,
    setPermissionStatus,
    getUserAppState,
  };
  return <Context.Provider value={props}>{children}</Context.Provider>;
};

export { Context, ContextProvider, useContext };
