# Nook — Project Notes

## What this is

Nook is a photo-sharing app I built for my fullstack sprint assignment. Think of it
as a stripped-down Instagram — you can sign up, post a photo with a caption, like
and comment on posts, edit your own captions, and check out your profile with all
your posts in one place.

The assignment asked for three things: connect a React frontend to a Node/Express
backend, fix the CORS issue that comes up when they run on different ports, and
handle image uploads properly (no saving base64 strings into MongoDB). I did all
three, and then kept building on top of it because I wanted it to actually feel
like a real app instead of just a CRUD demo.

## Why I built it this way

**MERN stack** — MongoDB, Express, React, Node. This is the stack the sprint was
built around, and it's also just a solid, well-documented combination for a
project like this.

**Cloudinary for images** — the assignment was explicit that images can't be saved
as base64 or binary directly in MongoDB. So the flow is: the browser sends the
image as `FormData`, Multer picks it up on the server as an in-memory buffer,
that buffer gets uploaded to Cloudinary, and only the URL Cloudinary hands back
gets saved to the Post document. MongoDB never sees the actual image data.

**JWT auth** — this wasn't in the original assignment, but once I had a "like"
feature working through an anonymous browser ID, it felt incomplete. Real
accounts made posts, comments, and profiles all make sense together, so I added
signup/login with bcrypt-hashed passwords and JWT tokens.

**React Router** — the app has separate pages (landing, feed, create post, post
detail, profile, login/signup) but none of them trigger a full page reload.
Routing is handled entirely on the client.

## How the pieces fit together

```
client/          → React app (Vite)
  src/
    components/  → reusable UI pieces (Navbar, PostItem, Comments, etc.)
    pages/       → one file per route (Landing, Feed, ProfilePage, etc.)
    api/         → all fetch() calls live here, nowhere else
    context/     → AuthContext holds the logged-in user + token globally

server/          → Express API
  models/        → Mongoose schemas (User, Post — Post embeds Comments)
  controllers/   → the actual logic for each route
  routes/        → maps URLs to controller functions
  middleware/    → auth check (JWT) and file upload handling (Multer)
  config/        → MongoDB and Cloudinary connection setup
```

The rule I followed: components never call `fetch` directly, they go through the
`api/` layer. Controllers never touch `req`/`res` formatting logic beyond
status codes and JSON — anything more complex would go in a separate service
layer, but this app didn't need that much complexity.

## Features, roughly in the order I built them

1. Basic CRUD — create, read, delete posts (the assignment's minimum)
2. Cloudinary image upload via Multer, replacing the base64 approach
3. React Router — split the single page into Landing / Feed / Create / Detail
4. Likes, tracked per-browser via a random ID in localStorage
5. A proper navbar (responsive, hamburger on mobile) and a footer
6. Search on the feed, a 404 page, edit captions (added the missing PUT route)
7. JWT authentication — signup, login, password hashing
8. Comments, tied to real accounts
9. Post ownership — only the author can edit/delete their post or comment
10. Profile pages — your own (with an editable bio) and public ones for others
11. Switched like-tracking from the anonymous browser ID to the real logged-in
    user ID, so switching accounts on the same browser doesn't break likes

## Known limitations

- Anonymous posting is still allowed (no login required to post), matching the
  original assignment. Anonymous posts can be deleted by anyone, since there's
  no owner to check against.
- Likes made while logged out are tracked by browser, not account — if someone
  likes a post anonymously and later logs in, that like won't carry over to
  their account.
- No image resizing/multiple sizes — Cloudinary stores one version per upload.
- No pagination on the feed yet — it loads everything at once.

## What I'd add with more time

- Pagination or infinite scroll on the feed
- Rate limiting on the API (currently anyone can hit endpoints as fast as they want)
- Email verification during signup
- Notifications when someone likes or comments on your post
