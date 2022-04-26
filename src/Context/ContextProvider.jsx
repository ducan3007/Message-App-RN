import React, { createContext, useState, useContext, useLayoutEffect } from "react";
import { signIn } from "../../firebase";
import { getObjectData } from "../AsyncStorage";
const Context = createContext();

const ContextProvider = ({ children }) => {
  const [Messages, setMessages] = useState([]);
  const [UserList, setUserList] = useState();
  const [permissionStatus, setPermissionStatus] = useState(null);
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

  const resetState = () => {
    setUserList();
    setRoomList();
  };
  const props = {
    Messages,
    User,
    UserList,
    permissionStatus,
    initAppLoading,
    setUserList,
    setMessages,
    setUser,
    resetState,
    setPermissionStatus,
  };
  return <Context.Provider value={props}>{children}</Context.Provider>;
};

export { Context, ContextProvider, useContext };
