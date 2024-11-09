import { StorageReference } from "firebase/storage";
import { firebaseConfig } from "@/fiebase/db";
import * as firebase from "firebase/app";
import { getAuth } from "firebase/auth";

export const getStorageUrl = (ref: StorageReference) => {
  return `https://storage.googleapis.com/${ref.bucket}/${ref.fullPath}`;
};

export const getAuthForUserCreation = (name: string): any => {
  const foundApp = firebase.getApps().find((app) => app.name === name);
  const app = foundApp
    ? foundApp
    : firebase.initializeApp(firebaseConfig, "auth-worker");
  return getAuth(app);
};
