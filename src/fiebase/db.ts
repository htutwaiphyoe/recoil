import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Options } from "react-firebase-hooks/firestore/dist/firestore/types";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "API_KEY",
//   authDomain: "ewsd-kmd.firebaseapp.com",
//   // The value of `databaseURL` depends on the location of the database
//   databaseURL: "https://ewsd-kmd.firebaseio.com",
//   projectId: "ewsd-kmd",
//   storageBucket: "ewsd-kmd.appspot.com",
//   messagingSenderId: "SENDER_ID",
//   appId: "APP_ID",
//   // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
//   measurementId: "G-MEASUREMENT_ID",
// };

const firebaseConfig = {
  apiKey: "AIzaSyAZg_ciG8z85GQHkzDniYJWNHfDOOZSXeU",
  authDomain: "ewsd-kmd.firebaseapp.com",
  projectId: "ewsd-kmd",
  storageBucket: "ewsd-kmd.appspot.com",
  messagingSenderId: "106900289356",
  appId: "1:106900289356:web:596c453441f643672001e9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
export { app, db, storage, auth, firebaseConfig };
