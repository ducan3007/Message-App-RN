import React, { useEffect } from "react";

import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import { Context, useContext } from "./Context/ContextProvider";
import { FirestorePresent,app,auth } from "../firebase";

const AppContainer = () => {
  const { User } = useContext(Context);

  useEffect(() => {
    FirestorePresent();
  }, [User,auth]);



  return (
    <NavigationContainer>
      <AppNavigator></AppNavigator>
    </NavigationContainer>
  );
};

export default AppContainer;
