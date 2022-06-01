import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { getStorage, ref as Ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getDocs,
  collection,
  addDoc,
  onSnapshot,
  query,
  initializeFirestore,
  updateDoc,
  doc,
  where,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
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

export const database = getDatabase(app, "https://chat-app-rn-71f85-default-rtdb.asia-southeast1.firebasedatabase.app");

const isOfflineForDatabase = {
  state: "offline",
  last_changed: Timestamp.now().nanoseconds,
};
const isOnlineForDatabase = {
  state: "online",
  last_changed: Timestamp.now().nanoseconds,
};
const isOfflineForFirestore = {
  state: "offline",
  last_changed: Timestamp.now().nanoseconds,
};

const isOnlineForFirestore = {
  state: "online",
  last_changed: Timestamp.now().nanoseconds,
};

export const FirestorePresent = () => {
  try {
    const uid = auth?.currentUser?.uid;

    if (uid) {
      const onlineRef = ref(database, ".info/connected");
      const userStatusDatabaseRef = ref(database, "/status/" + uid);
      const userStatusFirestoreRef = doc(db, "/users/" + uid);

      onValue(onlineRef, (snapshot) => {
        if (snapshot.val() == false) {
          setDoc(userStatusFirestoreRef, isOfflineForFirestore, { merge: true });
          return;
        }
        onDisconnect(userStatusDatabaseRef)
          .set(isOfflineForDatabase)
          .then(() => {
            set(userStatusDatabaseRef, isOnlineForDatabase);
            setDoc(userStatusFirestoreRef, isOnlineForFirestore, { merge: true });
          });
      });
    }
  } catch (error) {
    console.log(err);
  }
};

export const DisconnectBySignout = async (uid) => {
  const userStatusDatabaseRef = ref(database, "/status/" + uid);
  const userStatusFirestoreRef = doc(db, "/users/" + uid);
  set(userStatusDatabaseRef, isOfflineForDatabase);
  setDoc(userStatusFirestoreRef, isOfflineForFirestore, { merge: true });
};

export const updateLoadImageAsync = async (uri) => {
  let filePath = uri.split("/");
  let fileName = filePath[filePath.length - 1];

  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const imageRef = Ref(storage, `images/${fileName}`);

  const snapshot = await uploadBytes(imageRef, blob);

  blob.close();

  const url = await getDownloadURL(snapshot.ref);

  return url;
};

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
  docs.forEach((doc) => {
    id = doc.id;
  });
  return id;
};
export const updateActivity = (userId) => {
  return updateDoc(doc(db, "users", userId), { activity: true });
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
