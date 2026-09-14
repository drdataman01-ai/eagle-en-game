# Eagle Reading Quest

An English reading-comprehension site for *The Eyes of the Eagle: See the
Glory*, for grades 1-6.

- **Anyone can read the book for free** -- no login. `index.html` is the
  table of contents; `chapters/chapter-01.html` through `chapter-12.html`
  are the story pages.
- **The quiz game is separate and requires a login.** Each chapter has
  5 multiple-choice questions. A correct answer plays a "ding" sound and
  adds 20 points to the reader's total score. `quiz.html` handles
  registration/login and the questions.
- **The teacher dashboard** (`teacher.html`) is protected by a passcode
  set in `firebase-config.js`, and shows every student's name, total
  score, and which chapters they've completed.

## How login works in this version (no Firebase Authentication)

This version does **not** use Firebase Authentication at all -- it talks
directly to Firestore instead. This was a deliberate fallback after
running into a persistent "API key not valid" error from Firebase Auth's
Identity Toolkit service that could not be resolved through the normal
Google Cloud Console settings (API restrictions, enabling the API, etc.).
Firestore itself was working fine throughout, so this version relies on
Firestore alone:

- A student's reading name is turned into a simple identifier (lowercase,
  no spaces/punctuation) and used directly as a Firestore document ID
  under the `scores` collection.
- Their 6-digit code is stored as a plain field in that same document and
  checked directly by the page's own code at login time.
- The browser remembers who's logged in using `localStorage`, so a
  student doesn't have to retype their name and code every visit on the
  same device/browser.
- The teacher dashboard checks the passcode in your browser and then
  reads the whole `scores` collection directly.

### The trade-off, stated plainly

Because there's no real authentication, `firestore.rules` in this version
has to allow open read/write access to the `scores` collection for
*anyone*, not just the actual student. In practice that means: someone
who knew (or guessed) another student's reading name, and used Firestore
directly (not through the website), could read or change that student's
score. For a low-stakes classroom reading game -- nicknames and quiz
points, nothing sensitive -- this is a reasonable trade-off to get a
working product. It is **not** appropriate for any data that actually
needs to stay private or tamper-proof.

If you're able to resolve the underlying Firebase Auth / API key issue
later, the more secure, Auth-based version (where each student can only
read/write their own score, enforced by the database) is worth going
back to -- ask for it again and it can be restored.

## Setup steps

1. Go to [console.firebase.google.com](https://console.firebase.google.com),
   sign in, and create a project (or use an existing one).
2. Register a web app and copy its `firebaseConfig` values into
   `firebase-config.js` in this repo.
3. Go to **Build -> Firestore Database -> Create database**. Start in
   production mode, pick any location, then Enable.
4. In Firestore, click the **Rules** tab, paste in the contents of
   `firestore.rules` from this repo, and click **Publish**.
5. Open `firebase-config.js` and set `TEACHER_PASSCODE` to whatever you
   want teachers to use to view the class dashboard.
6. Push this repo to GitHub and turn on **GitHub Pages** (Settings ->
   Pages -> deploy from the `main` branch).

No Authentication setup is needed in this version -- skip that step
entirely in the Firebase console.

## File structure

```
index.html                 Public landing page / table of contents
chapters/chapter-NN.html   The 12 chapters, free to read, no login
quiz.html                  Student registration/login + the 5-question quizzes
teacher.html               Passcode-gated whole-class score dashboard
firebase-config.js         Your Firebase project keys + TEACHER_PASSCODE (edit this)
firestore.rules            Security rules -- paste into the Firebase console
images/ch01 ... ch12       The book's illustrations, one folder per chapter
```

## Editing content

All 12 chapters' text (with images already placed at their original
positions) and their 5 questions each live in the `BOOK` JavaScript
object near the top of the script in `quiz.html`. The same chapter text
also appears, standalone, in each `chapters/chapter-NN.html` file for
the free-reading pages -- if you edit the story, update both places.
