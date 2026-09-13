const firebaseConfig = {
  apiKey: "AIzaSyAFwnIMs8JDNX6JnoH25CIB_uzKxwRNN_w",
  authDomain: "eagle-en-game.firebaseapp.com",
  projectId: "eagle-en-game",
  storageBucket: "eagle-en-game.firebasestorage.app",
  messagingSenderId: "964609515170",
  appId: "1:964609515170:web:83135424315ff9bd7141fb"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const AUTH_EMAIL_DOMAIN = "eagle-quest.local";
const TEACHER_EMAIL = "teacher@eagle-quest-admin.local";
