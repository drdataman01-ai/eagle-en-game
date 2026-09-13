<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAFwnIMs8JDNX6JnoH25CIB_uzKxwRNN_w",
    authDomain: "eagle-en-game.firebaseapp.com",
    projectId: "eagle-en-game",
    storageBucket: "eagle-en-game.firebasestorage.app",
    messagingSenderId: "964609515170",
    appId: "1:964609515170:web:83135424315ff9bd7141fb",
    measurementId: "G-3BYNZNHFT9"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>