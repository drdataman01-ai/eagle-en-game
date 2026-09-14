/* ============================================================
   FIREBASE CONFIG
   ============================================================ */
const firebaseConfig = {
  apiKey: "AIzaSyAFwnIMs8JDNX6JnoH25CIB_uzKxwRNN_w",
  authDomain: "eagle-en-game.firebaseapp.com",
  projectId: "eagle-en-game",
  storageBucket: "eagle-en-game.firebasestorage.app",
  messagingSenderId: "964609515170",
  appId: "1:964609515170:web:83135424315ff9bd7141fb"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/* Change this to your own passcode before publishing the site.
   It gates the teacher dashboard (teacher.html). This is a light
   deterrent, not real security -- see README.md for details. */
const TEACHER_PASSCODE = "eagle2026";
