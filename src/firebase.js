import { initializeApp } from "firebase";

const app  = initializeApp({
    apiKey: "AIzaSyCo1mWEOkO6sZlXckel8G49Vys4a4--K-Q",
    projectId: "mziki-i",
    databaseURL: "https://mziki-i.firebaseio.com",
    authDomain: "mziki-i.firebaseapp.com",
    storageBucket: "mziki-i.appspot.com",
    messagingSenderId: "675307021913"
})

const firestore = app.firestore();
const settings = {
    timestampsInSnapshots: true
};
firestore.settings(settings);
firestore.enablePersistence();

export const auth = app.auth();

export const db = firestore;
export const linksRef = firestore.collection("link_urls");

export const storage = app.storage();
export const filesRef = function(name) {
    return storage.ref("audios/"+name);
}