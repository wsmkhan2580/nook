# Nook — Instagram-style Full-Stack App

## Pages
- **/** — Landing page with hero section
- **/feed** — All Posts (search bar included)
- **/create** — Create Post form (anonymous or logged-in)
- **/post/:id** — Post detail (product-page style): edit caption, copy link, like/unlike, comments, delete (with confirm dialog)
- **/login**, **/signup** — Authentication
- 404 page for any unmatched route

## Features
- Full CRUD: Create, Read, Update (caption), Delete
- **JWT Authentication** — signup/login, sessions persist via localStorage
- Posts show the author's name; only the author can edit/delete their own post
- Posts made while logged out stay anonymous and are still deletable by anyone (matches the original no-auth CRUD requirement)
- **Comments** — logged-in users can comment; only a comment's author can delete it
- Like once per browser (toggle) — tracked via a random ID in localStorage, independent of login
- Confirm dialog before any delete (post or comment)
- Search captions on the feed page
- Post count badge in the navbar
- Copy-link button on post detail
- Responsive navbar with hamburger menu below 640px
- No page reloads — all routing is client-side via React Router

## Setup

### Backend
```
cd server
npm install
cp .env.example .env
# fill in MONGO_URI, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, JWT_SECRET
npm run dev
```
`JWT_SECRET` can be any long random string — e.g. generate one with:
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend
```
cd client
npm install
cp .env.example .env
npm run dev
```

## API Routes

### Auth
| Method | Route            | Purpose                  |
|--------|-------------------|---------------------------|
| POST   | /api/auth/signup  | Create an account         |
| POST   | /api/auth/login   | Log in, get a JWT         |
| GET    | /api/auth/me      | Get current user (needs token) |

### Posts
| Method | Route                              | Purpose                          | Auth |
|--------|-------------------------------------|-----------------------------------|------|
| GET    | /api/posts                          | List all posts                    | No |
| GET    | /api/posts/:id                      | Get one post                      | No |
| POST   | /api/posts                          | Create a post (multipart/form-data) | Optional |
| PUT    | /api/posts/:id                      | Update caption                    | Required (owner only) |
| DELETE | /api/posts/:id                      | Delete a post                     | Required (owner only, or anyone if anonymous) |
| PATCH  | /api/posts/:id/like                 | Toggle like for a userId          | No |
| POST   | /api/posts/:id/comments              | Add a comment                     | Required |
| DELETE | /api/posts/:id/comments/:commentId  | Delete a comment                  | Required (comment author only) |

## Notes
- Images: Multer holds the file in memory as a buffer, uploads it to Cloudinary, and only the returned URL is saved to MongoDB — never base64/binary.
- Passwords are hashed with bcrypt before storage; JWTs expire after 30 days.
