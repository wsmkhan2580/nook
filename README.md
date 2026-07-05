# Nook — Instagram-style Full-Stack App

🔗 **Live**: [nook-gilt.vercel.app](https://nook-gilt.vercel.app/)
📦 **Repo**: [github.com/your-username/nook](https://github.com/your-username/nook)

## Pages
- `/` — Landing page
- `/feed` — All posts (with search)
- `/create` — Create a post
- `/post/:id` — Post detail — edit, like, comment, share, delete
- `/login`, `/signup` — Auth
- `/profile` — Your profile and posts

## Features
- Full CRUD (Create, Read, Update, Delete) on posts
- JWT authentication — signup/login, only the author can edit/delete their post
- Comments (logged-in users only, own comments deletable)
- Like once per user (toggle)
- Confirm dialog before delete
- Responsive navbar with hamburger menu
- Client-side routing — no page reloads

## Setup

### Backend
```
cd server
npm install
cp .env.example .env   # fill in MONGO_URI, CLOUDINARY keys, JWT_SECRET
npm run dev
```

### Frontend
```
cd client
npm install
cp .env.example .env   # set VITE_API_URL
npm run dev
```

## Tech
React, Vite, React Router · Node, Express · MongoDB, Mongoose · Cloudinary + Multer · JWT + bcrypt

## Notes
- Images are uploaded to Cloudinary via Multer (in-memory buffer) — only the URL is stored in MongoDB, never base64.
- Passwords are hashed with bcrypt; JWTs expire after 30 days.
- 
