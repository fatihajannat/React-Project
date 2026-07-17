# SocialApp

A Facebook-inspired social media platform, built entirely in React with no backend — every user, post, comment, and like lives in the browser's `localStorage`.

## Live Demo

🔗 **[Add your deployed link here after deploying to Vercel/Netlify]**

> Deploy in under a minute: run `vercel` in this folder (or drag the `dist/` folder into Netlify's "Deploys" tab after running `npm run build`).

## Screenshots

| Feed | Create Post |
|---|---|
| _add screenshot_ | _add screenshot_ |

| Profile | Dashboard |
|---|---|
| _add screenshot_ | _add screenshot_ |

> Take these after running `npm run dev` locally — Feed page, Create Post form (with an image selected), a Profile page, and the My Posts dashboard.

## Tech Stack

- **React (Vite)** — frontend framework and build tool
- **React Router v6** — routing, nested routes, protected routes
- **Tailwind CSS** — all styling, including dark mode via the `dark:` variant
- **React Hook Form** — every form: login, signup, create/edit post, profile settings
- **Context API** — global auth state (`AuthContext`)
- **clsx** — conditional className composition for component variants
- **React.lazy + Suspense** — route-level code splitting
- **localStorage** — the only data store; no backend, no database

## Features

- Signup with validated strong passwords, login, logout, and a session that survives a page refresh
- Public feed of published posts with a live search bar (filters as you type)
- Guests are redirected to `/login` with a contextual message when they try to like or comment
- Create posts with an image upload + live preview, a live character counter, and Public/Private visibility
- Save posts as drafts or publish them immediately
- Full post management: edit, delete (with a custom confirmation modal — not `confirm()`), and instant public/private toggling
- Post detail page with like/unlike and a full comment thread
- Comments can be deleted by their author only, with an inline "Are you sure? Yes / No" confirmation
- Public profile pages with cover image, avatar, bio, location, and joined date
- Profile settings with an avatar upload, live preview, and a bio character counter
- Dark mode toggle in the navbar, persisted across reloads
- Fully protected `/dashboard/*` routes — logged-out users are redirected to `/login`
- Responsive layout, mobile bottom tab bar for the dashboard

## How to Run Locally

```bash
git clone https://github.com/<your-username>/social-app-<your-name>.git
cd social-app-<your-name>
npm install
npm run dev
```

Then open `http://localhost:5173`.

To build for production:

```bash
npm run build
npm run preview
```

## Folder Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── post/
│   │   ├── PostCard.jsx
│   │   ├── PostForm.jsx
│   │   ├── PostActions.jsx
│   │   └── CommentSection.jsx
│   ├── profile/
│   │   └── ProfileHeader.jsx
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Avatar.jsx
│   │   └── Badge.jsx
│   └── RequireAuth.jsx
├── context/
│   └── AuthContext.jsx
├── hooks/
│   ├── useLocalStorage.js
│   ├── usePosts.js
│   └── useAuth.js
├── pages/
│   ├── FeedPage.jsx
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── PostDetailPage.jsx
│   ├── ProfilePage.jsx
│   ├── NotFoundPage.jsx
│   └── dashboard/
│       ├── DashboardLayout.jsx
│       ├── PostsDashboard.jsx
│       ├── CreatePost.jsx
│       ├── EditPost.jsx
│       └── ProfileSettings.jsx
├── utils/
│   ├── storage.js
│   └── helpers.js
├── App.jsx
└── main.jsx
```

## localStorage Data Structure

Everything lives under five keys, managed exclusively through `src/utils/storage.js`.

```js
// 'users'
[
  {
    id: 'usr_1703001234_abc',
    name: 'Asad Khan',
    email: 'asad@test.com',
    password: 'Password123',
    bio: 'React developer from Lahore',
    location: 'Lahore, Pakistan',
    avatar: 'data:image/jpeg;base64,...',
    coverImage: null,
    joinedAt: '2025-01-15T10:00:00Z',
  }
]

// 'posts'
[
  {
    id: 'post_1703001234_xyz',
    authorId: 'usr_1703001234_abc',
    description: 'Hello everyone!',
    image: 'data:image/jpeg;base64,...',
    isPublic: true,
    isDraft: false,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  }
]

// 'comments'
[
  { id: 'cmt_1703001234', postId: 'post_1703001234_xyz', authorId: 'usr_1703001234_abc', text: 'Great post!', createdAt: '2025-01-15T10:05:00Z' }
]

// 'likes'
[
  { id: 'like_1703001234', postId: 'post_1703001234_xyz', userId: 'usr_1703001234_abc', createdAt: '2025-01-15T10:03:00Z' }
]

// 'currentUser' — a single object (or absent), the logged-in session, password stripped
```

## What I Learned

*(Write this yourself, honestly — you'll be asked about it in the Q&A. As a starting point: building the `AuthContext` taught me how Context avoids prop drilling for state that many unrelated components need, like the navbar and every protected route. Working with `localStorage` as the only data layer forced me to think carefully about data shape up front, since there's no server to validate or reshape anything for me. React Hook Form's `register` and `watch` made building five different forms with validation far less repetitive than controlling every input by hand. Getting `React.lazy` and protected routes to work together also taught me how `Suspense` boundaries and route guards interact. Add at least two more sentences in your own words about what was genuinely hard.)*

## Known Limitations

- All data is local to one browser — nothing syncs across devices, and clearing browser storage wipes the whole app
- Passwords are stored in plain text in `localStorage`, which is fine for a learning project but would never be acceptable with a real backend (should be hashed server-side, e.g. with bcrypt)
- No pagination — the feed loads every public post at once, which wouldn't scale
- No real-time updates — if a second user is logged in in another tab, changes don't push automatically
- With a real backend (Node/Express + MongoDB, matching the rest of the bootcamp's MERN stack), this would move to: hashed passwords + JWT auth, server-side validation, image uploads to cloud storage instead of base64 blobs, and pagination/infinite scroll for the feed
