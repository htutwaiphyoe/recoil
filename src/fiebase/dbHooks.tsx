//@ts-nocheck
import {
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  getCountFromServer,
  Query,
  query,
  QueryConstraint,
  setDoc,
} from "firebase/firestore";
import {
  useCollection,
  useCollectionData,
  useDocument,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { Options } from "react-firebase-hooks/firestore/dist/firestore/types";
import { auth, db, storage } from "./db";
import { getAuthForUserCreation } from "@/utils/firebaseUtils";
import { ref, getStorage } from "firebase/storage";
import { useDownloadURL } from "react-firebase-hooks/storage";
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { async } from "@firebase/util";
import { useEffect, useState } from "react";

const generatePushID = (function () {
  // Modeled after base64 web-safe chars, but ordered by ASCII.
  var PUSH_CHARS =
    "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

  // Timestamp of last push, used to prevent local collisions if you push twice in one ms.
  var lastPushTime = 0;

  // We generate 72-bits of randomness which get turned into 12 characters and appended to the
  // timestamp to prevent collisions with other clients.  We store the last characters we
  // generated because in the event of a collision, we'll use those same characters except
  // "incremented" by one.
  var lastRandChars = [];

  return function () {
    var now = new Date().getTime();
    var duplicateTime = now === lastPushTime;
    lastPushTime = now;

    var timeStampChars = new Array(8);
    for (var i = 7; i >= 0; i--) {
      timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
      // NOTE: Can't use << here because javascript will convert to int and lose the upper bits.
      now = Math.floor(now / 64);
    }
    if (now !== 0)
      throw new Error("We should have converted the entire timestamp.");

    var id = timeStampChars.join("");

    if (!duplicateTime) {
      for (i = 0; i < 12; i++) {
        lastRandChars[i] = Math.floor(Math.random() * 64);
      }
    } else {
      // If the timestamp hasn't changed since last push, use the same random number, except incremented by 1.
      for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
        lastRandChars[i] = 0;
      }
      lastRandChars[i]++;
    }
    for (i = 0; i < 12; i++) {
      id += PUSH_CHARS.charAt(lastRandChars[i]);
    }
    if (id.length != 20) throw new Error("Length should be 20.");

    return id;
  };
})();

export const useCol = <T,>(
  path: string,
  options?: Options,
  ...args: QueryConstraint[]
) => {
  const data = useCollection<T>(
    query<T>(collection(db, path) as Query<T>, ...args),
    {
      snapshotListenOptions: { includeMetadataChanges: true },

      ...options,
    }
  );
  return data;
};

export const useDocData = <T,>(path: string, options?: Options) => {
  const data = useDocumentData<T>(doc(db, path) as DocumentReference<T>, {
    snapshotListenOptions: { includeMetadataChanges: true },
    ...options,
  });

  return data;
};
export const useDoc = <T,>(path: string, options?: Options) => {
  const data = useDocument<T>(doc(db, path) as DocumentReference<T>, {
    snapshotListenOptions: { includeMetadataChanges: true },
    ...options,
  });

  return data;
};

export const setData = async (path: string, data: any, id?: string = "") => {
  return setDoc(doc(db, path, id ? id : generatePushID()), data);
};

export const deleteData = async (path: string) => {
  return deleteDoc(doc(db, path));
};

export const useImage = (path?: string) => {
  const data = useDownloadURL(ref(storage, path));
  return data;
};

export const signIn = (email, pass) => {
  return signInWithEmailAndPassword(auth, email, pass);
};

export const signUp = (email, pass) => {
  const signUpAuth = getAuthForUserCreation("auth-worker");
  return createUserWithEmailAndPassword(signUpAuth, email, pass);
};

export const sendResetPasswordEmail = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const logout = () => {
  signOut(auth);
};

export const useAuthUser = () => {
  const [user, loading, error] = useAuthState(auth);

  return {
    userId: user?.uid,
    user,
    loading,
    error,
  };
};

export const useGetCount = (path, ...args) => {
  const [count, setcount] = useState(0);

  const setCountValue = async () => {
    try {
      const coll = collection(db, path);
      const q = query(coll, ...args);
      const snapshot = await getCountFromServer(q);
      setcount(snapshot.data().count);
    } catch (e) {}
  };

  useEffect(() => {
    setCountValue();
  }, [args]);

  return count;
};
