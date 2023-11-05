import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: 'AIzaSyBgy_O0YFw0iEwjHz1B5VKMnRT9JNREZZ0',
    authDomain: "nbabettingtracker.firebaseapp.com",
    projectId: "nbabettingtracker",
    storageBucket: "nbabettingtracker.appspot.com",
    messagingSenderId: "11276115862",
    appId: "1:11276115862:web:aa6c7c37524a61cc56c7b7"
  };

//   initialize firebase
firebase.initializeApp(firebaseConfig)

// initialize services, firestore and auth
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()

const timestamp = firebase.firestore.Timestamp

export {projectFirestore, projectAuth, timestamp}