import firebase from "firebase"

const firebaseConfig = {
    // Firebase configaration
};

firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()
const timestamp = firebase.firestore.FieldValue.serverTimestamp()

export { db, auth, storage, timestamp }