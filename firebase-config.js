/* ============================================================
   FIREBASE CONFIG — fill this in with your own project's values.
   See README.md for step-by-step setup instructions.
   These values are safe to be public in client-side code; they
   identify your project, they are not secret keys.
   ============================================================ */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

/* Change this to your own passcode before publishing the site.
   It gates the teacher dashboard (teacher.html). This is a light
   deterrent, not real security — see README.md for details. */
const TEACHER_PASSCODE = "eagle2026";

/* Internal domain used to turn a student's chosen reading name
   into a Firebase Auth email under the hood. Students never see
   or type an email address. */
const AUTH_EMAIL_DOMAIN = "eagle-quest.local";
