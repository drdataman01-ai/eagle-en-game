# Eagle Reading Quest

An English reading-comprehension site for *The Eyes of the Eagle: See the
Glory*, for grades 1–6.

- **Anyone can read the book for free** — no login, just like a normal
  website. `index.html` is the table of contents; `chapters/chapter-01.html`
  through `chapter-12.html` are the story pages.
- **The quiz game is separate and requires a login.** Each chapter has
  5 multiple-choice questions. A correct answer plays a "ding" sound and
  adds 20 points to the reader's total score. `quiz.html` handles
  registration/login and the questions.
- **Only the teacher can see everyone's score.** Each student can only
  see their own total. `teacher.html` is a separate, passcode-protected
  page that shows every student's name, total score, and which chapters
  they've completed — enforced by the database rules, not just hidden
  in the page.

## Why this needs a one-time setup step

The reading pages are plain static files — they work on GitHub Pages
with zero setup. But "students can register and log in" and "only the
teacher can see everyone's score" both require somewhere to actually
store and protect that data, which a static site has no way to do on
its own.

This project uses **Firebase** (a free Google service) for that:
- **Firebase Authentication** handles both student login (nickname + 6-digit
  code) and the teacher's separate login.
- **Firestore** (Firebase's database) stores each student's score and
  chapter progress, with security rules that enforce who can read what.

## Setup steps

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
   and sign in with any Google account.
2. Click **Add project**, give it any name (e.g. "eagle-reading-quest"),
   and finish the wizard (Google Analytics is optional — you can skip it).
3. Click the **`</>`** (web) icon to register a web app. Firebase will
   show a `firebaseConfig` object — copy those values into
   `firebase-config.js` in this repo, replacing the placeholder values.
4. Go to **Build → Authentication → Get started**. Under "Sign-in
   method," enable **Email/Password**.
5. Go to **Build → Firestore Database → Create database**. Start in
   **production mode**. Pick any location.
6. In Firestore, click the **Rules** tab, delete the default rules,
   paste in the contents of `firestore.rules` from this repo, and click
   **Publish**.
7. Push this repo to GitHub and turn on **GitHub Pages** (Settings →
   Pages → deploy from the `main` branch).

That's it. Students go to your site, read any chapter for free, and
click "Take the Chapter N Quiz" whenever they're ready to register/log
in and answer questions.

## Setting the teacher passcode

There's nothing to configure for this — go to `teacher.html` on your
live site and type any passcode you want (6+ characters). The first
time, it creates the teacher account with that passcode; every time
after that, the same passcode logs back in. Just remember what you
chose, and don't share it with students.

## How the login works (and why scores stay private)

Students never type or see an email address — they pick a nickname and
a 6-digit code, and the app turns that into a hidden internal email
behind the scenes so Firebase's login system can handle it securely.

Each student's score document can only be read by that student's own
login, or by the one reserved teacher account — this is enforced by
`firestore.rules`, not just by what buttons the page shows. A student
looking at the raw data would not be able to see anyone else's score.

If a student forgets their code, there's no recovery flow — the
simplest fix is to have them register again with a slightly different
reading name (their old progress stays under the old name, unreachable,
which is fine for a game like this).

## File structure

```
index.html            Public landing page / table of contents
chapters/chapter-NN.html   The 12 chapters, free to read, no login
quiz.html              Student registration/login + the 5-question quizzes
teacher.html           Teacher login + whole-class score dashboard
firebase-config.js     Your Firebase project keys (edit this)
firestore.rules        Security rules — paste into the Firebase console
images/ch01 … ch12     The book's illustrations, one folder per chapter
```

## Editing content

All 12 chapters' text (with images already placed at their original
positions) and their 5 questions each live in the `BOOK` JavaScript
object near the top of the script in `quiz.html`. The same chapter text
also appears, standalone, in each `chapters/chapter-NN.html` file for
the free-reading pages — if you edit the story, update both places.
