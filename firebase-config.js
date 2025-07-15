

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "FIREBASE CONFIG_API_KEY",
  authDomain: "FIREBASE AUTH DOMAIN",
  projectId: "FIREBASE PROJECT_ID",
  storageBucket: "FIREBASE STORAGE_BUCKET",
  messagingSenderId: "FIREBASE MESSAGING_SENDERID",
  appId: "FIREBASE APP_ID",
  measurementId: "FIREBASE MEASUREMENTID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const analytics = getAnalytics(app);
