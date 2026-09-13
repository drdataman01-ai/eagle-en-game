# Eagle Reading Quest

An English reading-comprehension game for *The Eyes of the Eagle: See the Glory*,
built for grades 1–6. Students log in with a nickname and a 6-digit code,
read a chapter, answer three leveled questions per chapter, and earn stars
and points that are saved to the cloud. A teacher/parent dashboard shows
everyone's total score and which chapters each student has finished.

## Why this needs a one-time setup step

`index.html` and `teacher.html` are plain static pages — they can live on
GitHub Pages for free, same as your other site. But "every student can log
in" and "I can see everyone's score" both require somewhere to actually
store that data, and a static site has no server of its own to do that.

This project uses **Firebase** (a free Google service) to fill that gap:
- **Firebase Authentication** handles student login (a nickname + 6-digit
  code, stored securely — students never type or see an email address).
- **Firestore** (Firebase's database) stores each student's stars, points,
  and per-chapter completion, and lets the teacher dashboard read everyone's
  scores at once.

You need a free Firebase project before this will work. It takes about
10 minutes and doesn't require a credit card for this scale of use.

## Setup steps

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
   and sign in with any Google account.
2. Click **Add project**, give it any name (e.g. "eagle-reading-quest"),
   and finish the wizard (you can decline Google Analytics).
3. In your new project, click the **`</>`** (web) icon to register a web
   app. Give it any nickname. Firebase will show you a code block with a
   `firebaseConfig` object — copy those values into `firebase-config.js`
   in this repo, replacing the placeholder values.
4. In the left sidebar, go to **Build → Authentication → Get started**.
   Under "Sign-in method," enable **Email/Password**.
5. In the left sidebar, go to **Build → Firestore Database → Create
   database**. Start in **production mode**. Pick any location close to
   your students.
6. Still in Firestore, click the **Rules** tab, delete the default rules,
   paste in the contents of `firestore.rules` from this repo, and click
   **Publish**.
7. Open `firebase-config.js` and change `TEACHER_PASSCODE` to something
   only you know — this is what protects `teacher.html`.
8. Push this repo to GitHub and turn on **GitHub Pages** (Settings →
   Pages → deploy from the `main` branch).

That's it — students can now go to your GitHub Pages URL, pick a reading
name and a 6-digit code, and start playing. You can view the class
dashboard any time at `your-site-url/teacher.html`.

## A note on how "login" works here

There's no email collection and no password reset flow — students just
pick a nickname and a 6-digit code they'll remember. Behind the scenes,
the app turns that into a fake email address (like `sam@eagle-quest.local`)
so Firebase's normal login system can handle it securely, but a student
never sees or types an email. If a student forgets their code, the
simplest fix is to have them start over with a slightly different reading
name (e.g. add a number) — there's no built-in recovery.

## A note on the teacher dashboard's security

`teacher.html` is protected by a single shared passcode you set in
`firebase-config.js`, and the Firestore rules let *any* signed-in user
(including students) technically read the whole `scores` collection, not
only the teacher. This is a lightweight setup appropriate for a small
class project — it is **not** bank-grade security. Don't collect real
names, emails, or anything sensitive beyond a nickname and a game score,
and don't publish the teacher passcode.

## File structure

```
index.html          The student-facing game (reading + quiz + login)
teacher.html         The teacher/parent dashboard (passcode-gated)
firebase-config.js    Your Firebase project keys + teacher passcode (edit this)
firestore.rules       Security rules to paste into the Firebase console
images/ch01 … ch12    The book's illustrations, one folder per chapter
```

## Editing the book content

All 12 chapters' text and their 3 questions each (Spot It / Figure It Out /
Big Idea) live in the `BOOK` JavaScript object near the top of the script
in `index.html`. Each chapter's `text` field is HTML — images are already
placed at their original positions in the story using `<img>` tags
pointing into the matching `images/chNN/` folder.
