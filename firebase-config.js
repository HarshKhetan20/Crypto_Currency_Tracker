

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyDuYa9g5U_mfGFKP9ro9_az9NgDKpkWpRA",
  authDomain: "cryptocurrency-tracker-9cdb2.firebaseapp.com",
  projectId: "cryptocurrency-tracker-9cdb2",
  storageBucket: "cryptocurrency-tracker-9cdb2.appspot.com",
  messagingSenderId: "207586720773",
  appId: "1:207586720773:web:9de1790acad858226c306c",
  measurementId: "G-KJ79XNES62"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const analytics = getAnalytics(app);