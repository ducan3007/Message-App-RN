import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut, onAuthStateChanged, } from "firebase/auth";

import { getStorage, ref as Ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDocs, collection, addDoc, onSnapshot, query, initializeFirestore, updateDoc, doc, where, getDoc, serverTimestamp, setDoc, Timestamp, } from "firebase/firestore";
import { getDatabase, ref, onValue, set, onDisconnect } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAL7PAfmHFaCZc0ju6tJIeK45oMCvqFD4o",
  authDomain: "chat-app-rn-71f85.firebaseapp.com",
  projectId: "chat-app-rn-71f85",
  storageBucket: "chat-app-rn-71f85.appspot.com",
  messagingSenderId: "461996861967",
  appId: "1:461996861967:web:56c07a6d09b565af41117a",
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});



export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}
export const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};
export const getUserID = async (email) => {
  const q = query(collection(db, "users"), where("email", "==", email));
  let docs = await getDocs(q);
  let id;
  docs.forEach((doc)=>{
    id = doc.id
  })
  return id;
};


export {
  updateProfile,
  onAuthStateChanged,
  signOut,
  collection,
  getDocs,
  getDoc,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  query,
  where,
  ref,
  Ref,
  setDoc,
  uploadBytes,
  serverTimestamp,
  getDownloadURL,
  Timestamp,
};
