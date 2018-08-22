import { initializeApp } from "firebase";

const app  = initializeApp({
    apiKey: "AIzaSyCo1mWEOkO6sZlXckel8G49Vys4a4--K-Q",
    projectId: "mziki-i",
    databaseURL: "https://mziki-i.firebaseio.com",
    authDomain: "mziki-i.firebaseapp.com",
    storageBucket: "mziki-i.appspot.com",
    messagingSenderId: "675307021913"
})

// const db = firebase.firestore()
export const db = app.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

export const auth = app.auth();
export const linksRef = db.collection("link_urls");