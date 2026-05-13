import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";

const app = initializeApp({
  apiKey: "AIzaSyBN0QPRjdUPf-IgiUcU2TLSBrQtXTSKmTE",
  authDomain: "cabin-builder.firebaseapp.com",
  databaseURL: "https://cabin-builder-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cabin-builder",
  storageBucket: "cabin-builder.firebasestorage.app",
  messagingSenderId: "563399939409",
  appId: "1:563399939409:web:e53295348375ba55bdaf70",
});

const db = getDatabase(app);
export const stateRef = ref(db, "state");
