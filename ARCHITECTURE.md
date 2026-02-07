# TaskPlanet - Architecture Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER (Client)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   React Application                       │  │
│  │  ┌────────────┐  ┌──────────┐  ┌──────────┐              │  │
│  │  │   Pages    │  │Components│  │ Context  │              │  │
│  │  │ · Login    │  │ · Header │  │ · Auth   │              │  │
│  │  │ · Signup   │  │ · Posts  │  │ · State  │              │  │
│  │  │ · Feed     │  │ · Create │  │          │              │  │
│  │  └────────────┘  └──────────┘  └──────────┘              │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │            API Service (Axios)                     │  │  │
│  │  │  · authAPI.login()                                │  │  │
│  │  │  · postsAPI.getAllPosts()                         │  │  │
│  │  │  · postsAPI.likePost()                            │  │  │
│  │  │  · postsAPI.addComment()                          │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│               HTTP(S) Requests with JWT Token                   │
│                                                                  │
└────────┬───────────────────────────────────────────────────────┘
         │
         │ REST API Calls
         │
┌────────▼───────────────────────────────────────────────────────┐
│                  Node.js + Express Server                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     Routes                                │  │
│  │  ┌──────────────────┐  ┌─────────────────────┐          │  │
│  │  │  Auth Routes     │  │  Posts Routes       │          │  │
│  │  │ · POST /signup   │  │ · GET /posts        │          │  │
│  │  │ · POST /login    │  │ · POST /posts       │          │  │
│  │  │ · GET /me        │  │ · DELETE /posts/:id │          │  │
│  │  │                  │  │ · POST /:id/like    │          │  │
│  │  │                  │  │ · POST /:id/comment │          │  │
│  │  └──────────────────┘  └─────────────────────┘          │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Middleware                               │  │
│  │  · CORS                                                   │  │
│  │  · JWT Authentication                                    │  │
│  │  · Error Handling                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Models                                  │  │
│  │  · User Schema                                            │  │
│  │  · Post Schema                                            │  │
│  │  · Comment Subdocument                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────┬───────────────────────────────────────────────────────┘
         │
         │ Database Queries
         │
┌────────▼───────────────────────────────────────────────────────┐
│                MongoDB (Data Persistence)                       │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │  Users Collection    │  │  Posts Collection    │            │
│  │                      │  │                      │            │
│  │ · _id               │  │ · _id                │            │
│  │ · username          │  │ · author (User ID)   │            │
│  │ · email             │  │ · content            │            │
│  │ · password (hashed) │  │ · likes (User IDs)   │            │
│  │ · profilePicture    │  │ · comments           │            │
│  │ · followers/following│  │ · likeCount          │            │
│  │ · timestamps        │  │ · commentCount       │            │
│  │                      │  │ · category           │            │
│  │                      │  │ · timestamps         │            │
│  └──────────────────────┘  └──────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow: Creating a Post

```
User Interface (React)
    │
    ├─→ User fills form & clicks "Post"
    │
    ▼
CreatePost Component
    │
    ├─→ Validate input
    │
    ▼
API Service (postsAPI.createPost)
    │
    ├─→ Prepare request with JWT token
    ├─→ Content, image, category
    │
    ▼
HTTP POST to /api/posts
    │
    ├─→ Express receives request
    │
    ▼
Authentication Middleware
    │
    ├─→ Verify JWT token
    ├─→ Extract userId
    │
    ▼
Posts Route Handler
    │
    ├─→ Validate input
    ├─→ Create Post document
    ├─→ Set author = userId
    ├─→ Save to MongoDB
    │
    ▼
Post Response
    │
    ├─→ HTTP 201 Created
    ├─→ Return full post object
    │
    ▼
React Component
    │
    ├─→ Add post to state
    ├─→ Update UI
    ├─→ Show new post at top
    │
    ▼
User sees post instantly
```

## Authentication Flow

```
┌─────────────────────────┐
│      User Signs Up      │
├─────────────────────────┤
│ 1. Enter username, email
│ 2. Enter password
│ 3. Click Sign Up
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   Backend /auth/signup              │
├─────────────────────────────────────┤
│ 1. Validate input                   │
│ 2. Check if user exists             │
│ 3. Hash password (bcryptjs)         │
│ 4. Create User document             │
│ 5. Save to MongoDB                  │
│ 6. Generate JWT token               │
└────────┬────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│   Response: {token, user}            │
├──────────────────────────────────────┤
│ token: "eyJhbGciOi..."               │
│ user: { id, username, email }        │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│   React Store Token          │
├──────────────────────────────┤
│ localStorage.setItem("token",│
│   token)                     │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│   Set User in Context        │
├──────────────────────────────┤
│ setUser(user data)           │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│   Redirect to Feed           │
├──────────────────────────────┤
│ Navigate to "/"              │
└──────────────────────────────┘
```

## Like/Unlike Flow

```
User clicks ♥ icon on post
    │
    ▼
PostCard checks isLiked state
    │
    ├─→ Determine if to like or unlike
    │
    ▼
Call postsAPI.likePost(postId)
    │
    ├─→ Send POST to /api/posts/:id/like
    ├─→ Include JWT token
    │
    ▼
Backend Route Handler
    │
    ├─→ Verify token (get userId)
    ├─→ Find post
    ├─→ Check if user already liked
    │
    ├─→ If yes: Remove userId from likes array
    ├─→ If no: Add userId to likes array
    │
    ├─→ Update likeCount
    ├─→ Save to MongoDB
    │
    ▼
Return updated post
    │
    ▼
React component
    │
    ├─→ Update posts array
    ├─→ Update like count
    ├─→ Update heart color (red if liked)
    │
    ▼
UI reflects change instantly
```

## Comment System Flow

```
User types in comment input
    │
    ▼
Click "Post" button
    │
    ▼
postsAPI.addComment(postId, text)
    │
    ├─→ POST /api/posts/:id/comment
    ├─→ Body: { text: "comment text" }
    ├─→ Header: Authorization: Bearer token
    │
    ▼
Backend
    │
    ├─→ Verify JWT → get userId
    ├─→ Find post
    ├─→ Create comment object
    │   · _id (MongoDB auto-generates)
    │   · author: userId
    │   · text: "comment text"
    │   · createdAt: now
    │
    ├─→ Push to comments array
    ├─→ Increment commentCount
    ├─→ Save post
    │
    ▼
Return updated post with new comment
    │
    ▼
React onCommentAdded handler
    │
    ├─→ Update state with new post
    ├─→ Re-render comments list
    ├─→ Clear input field
    │
    ▼
New comment appears in list
```

## Request Authentication

Every protected request includes JWT token:

```
Request Headers:
├── Content-Type: application/json
├── Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
└── (other standard headers)

Backend Middleware:
├── 1. Extract token from Authorization header
├── 2. Verify signature using JWT_SECRET
├── 3. Decode token → get userId
├── 4. Set req.userId = decoded.userId
├── 5. Pass to route handler

Route Handler:
├── Can access req.userId
├── Can verify ownership (author._id === req.userId)
└── Can prevent unauthorized actions
```

## Component Hierarchy

```
App
├── Routes
│   ├── /login → Login Page
│   ├── /signup → Signup Page
│   └── / → Feed Page
│       ├── Header
│       │   └── User profile, logout
│       ├── CreatePost
│       │   └── Form with textarea
│       ├── FilterTabs
│       │   ├── Category buttons
│       │   └── Sort dropdown
│       └── PostsList
│           └── PostCard (multiple)
│               ├── Author info
│               ├── Content
│               ├── Interactions
│               │   ├── Like button
│               │   ├── Comment button
│               │   └── Share button
│               └── CommentsSection
│                   ├── Comments list
│                   └── Comment form
```

## State Management

```
AuthContext
├── user (current user object)
│   ├── id
│   ├── username
│   ├── email
│   └── profilePicture
├── loading (boolean)
├── error (error message)
├── login() (function)
├── signup() (function)
└── logout() (function)

Feed Component State
├── posts (array)
├── loading (boolean)
├── activeFilter (string)
├── sortBy (string)
└── handlePostCreated() (function)

PostCard Component State
├── showComments (boolean)
├── commentText (string)
└── loading (boolean)
```

## API Response Structure

All responses follow this pattern:

```javascript
// Success (2xx)
{
  "message": "Operation successful",
  "token": "JWT token if auth",
  "user": { user object },
  "data": { response data }
}

// Error (4xx, 5xx)
{
  "message": "Error description",
  "error": "Technical details"
}
```

## Database Relationships

```
User (one-to-many) Post
│
├─ Author relationship
│  └─ Post.author → User._id
│
├─ Likes relationship
│  └─ Post.likes → [User._id, User._id, ...]
│
└─ Comments relationship
   └─ Post.comments[].author → User._id

User (many-to-many) User
├─ Followers relationship
│  └─ User.followers → [User._id, ...]
│
└─ Following relationship
   └─ User.following → [User._id, ...]
```

## Deployment Architecture (Production)

```
┌──────────────────────────────────────────────────────────────┐
│                     Internet                                 │
└────────────┬──────────────────────────────────────────────────┘
             │
             ├─────────────────┬──────────────────────┐
             │                 │                      │
    ┌────────▼────────┐ ┌──────▼──────────┐ ┌───────▼───────┐
    │  Vercel CDN     │ │ Heroku/Railway  │ │  MongoDB      │
    │  (Frontend)     │ │  (Backend)      │ │  Atlas        │
    │                 │ │                 │ │  (Database)   │
    │ React App       │ │ Express Server  │ │               │
    │ (HTML/CSS/JS)   │ │ Node.js         │ │ Collections:  │
    │                 │ │                 │ │ · Users       │
    │ Served at:      │ │ API at:         │ │ · Posts       │
    │ taskplanet.com  │ │ api.taskplanet. │ │               │
    │                 │ │ com             │ │ Backups: Auto │
    │ Auto-deploys    │ │                 │ │ Daily         │
    │ from GitHub     │ │ Auto-deploys    │ │               │
    │                 │ │ from GitHub     │ │ Replication:  │
    │                 │ │                 │ │ Multi-region  │
    └────────────────┘ └─────────────────┘ └───────────────┘
             │                 │                      │
             └─────────┬───────┘──────────────────────┘
                       │
                    HTTPS
                   (Encrypted)
```

## Scaling Considerations

```
Current Setup (Single Instance)
│
├─ 1 Frontend server
├─ 1 Backend server  
├─ 1 Database instance
└─ Handles ~100 concurrent users

Scale to Multiple Instances
│
├─ Frontend
│  └─ CDN with edge locations (auto-scaling)
│
├─ Backend
│  ├─ Load balancer
│  ├─ Multiple servers (auto-scaling)
│  └─ Connection pooling to DB
│
└─ Database
   ├─ Read replicas
   ├─ Sharding (if needed)
   └─ Connection pooling

Cache Layer (Add when needed)
│
├─ Redis for session storage
├─ Redis for post caching
└─ CDN for static assets
```

## Security Architecture

```
Public
  │
  ├─→ Signup/Login endpoints (no auth needed)
  └─→ Get posts (no auth needed)

Private (Requires JWT Token)
  │
  ├─→ Create post
  ├─→ Delete own post
  ├─→ Like post
  ├─→ Add comment
  ├─→ Delete own comment
  └─→ Get profile

Database Security
  │
  ├─→ Passwords hashed (bcryptjs)
  ├─→ Indexes for performance
  ├─→ MongoDB Atlas encryption at rest
  ├─→ Connection encryption (SSL)
  └─→ IP whitelisting
```

## Performance Optimizations

```
Frontend
├─ Code splitting (React Router)
├─ Lazy loading components
├─ Image optimization
├─ CSS Module scoping
└─ Caching (browser cache)

Backend
├─ Database indexing on popular fields
├─ Connection pooling
├─ Gzip compression
├─ Caching headers
└─ Query optimization

Database
├─ Indexes on:
│  ├─ User.email
│  ├─ User.username
│  ├─ Post.author
│  └─ Post.createdAt
└─ TTL indexes for cleanup
```

---

**This architecture is designed to be:**
- Simple to understand
- Easy to deploy
- Ready to scale
- Secure by default
- Performant out of the box
