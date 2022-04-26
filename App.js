import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";;
import { ContextProvider } from "./src/Context/ContextProvider";
import AppContainer from "./src/AppContainer.jsx";




export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ContextProvider>
      <AppContainer />;
      </ContextProvider>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
