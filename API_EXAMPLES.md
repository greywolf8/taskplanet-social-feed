# TaskPlanet API Examples

## Overview

All API endpoints are accessible at `http://localhost:5000/api` in development.
Replace with your production URL when deployed.

## Authentication Endpoints

### 1. Sign Up

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### 2. Login

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "profilePicture": "https://via.placeholder.com/150?text=User"
  }
}
```

### 3. Get Current User

**Request:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "profilePicture": "https://via.placeholder.com/150?text=User",
  "bio": "",
  "followers": [],
  "following": [],
  "createdAt": "2024-02-06T10:30:00.000Z",
  "updatedAt": "2024-02-06T10:30:00.000Z"
}
```

## Posts Endpoints

### 4. Create Post

**Request:**
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content": "Just launched my new project!",
    "image": null,
    "category": "All Posts"
  }'
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "author": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "profilePicture": "https://via.placeholder.com/150?text=User"
  },
  "content": "Just launched my new project!",
  "image": null,
  "likes": [],
  "comments": [],
  "likeCount": 0,
  "commentCount": 0,
  "category": "All Posts",
  "createdAt": "2024-02-06T10:35:00.000Z",
  "updatedAt": "2024-02-06T10:35:00.000Z"
}
```

### 5. Get All Posts

**Request:**
```bash
# Get all posts (newest first)
curl -X GET "http://localhost:5000/api/posts"

# Get posts from specific category
curl -X GET "http://localhost:5000/api/posts?category=Most%20Liked"

# Sort by likes
curl -X GET "http://localhost:5000/api/posts?sortBy=likes"

# Sort by comments
curl -X GET "http://localhost:5000/api/posts?sortBy=comments"
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "author": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "profilePicture": "https://via.placeholder.com/150?text=User"
    },
    "content": "Just launched my new project!",
    "image": null,
    "likes": ["507f1f77bcf86cd799439013"],
    "comments": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "author": {
          "_id": "507f1f77bcf86cd799439013",
          "username": "jane_doe",
          "profilePicture": "https://via.placeholder.com/150?text=User"
        },
        "text": "Looks amazing!",
        "createdAt": "2024-02-06T10:40:00.000Z"
      }
    ],
    "likeCount": 1,
    "commentCount": 1,
    "category": "All Posts",
    "createdAt": "2024-02-06T10:35:00.000Z",
    "updatedAt": "2024-02-06T10:40:00.000Z"
  }
]
```

### 6. Get Single Post

**Request:**
```bash
curl -X GET http://localhost:5000/api/posts/507f1f77bcf86cd799439012
```

**Response (200):** (same as create post response above)

### 7. Like/Unlike Post

**Request:**
```bash
curl -X POST http://localhost:5000/api/posts/507f1f77bcf86cd799439012/like \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "author": { ... },
  "content": "Just launched my new project!",
  "likes": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439013"],
  "comments": [],
  "likeCount": 2,
  "commentCount": 0,
  "createdAt": "2024-02-06T10:35:00.000Z",
  "updatedAt": "2024-02-06T10:42:00.000Z"
}
```

### 8. Add Comment

**Request:**
```bash
curl -X POST http://localhost:5000/api/posts/507f1f77bcf86cd799439012/comment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "text": "This is awesome! Great work!"
  }'
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "author": { ... },
  "content": "Just launched my new project!",
  "likes": [],
  "comments": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "author": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "john_doe",
        "profilePicture": "https://via.placeholder.com/150?text=User"
      },
      "text": "This is awesome! Great work!",
      "createdAt": "2024-02-06T10:45:00.000Z"
    }
  ],
  "likeCount": 0,
  "commentCount": 1,
  "createdAt": "2024-02-06T10:35:00.000Z",
  "updatedAt": "2024-02-06T10:45:00.000Z"
}
```

### 9. Delete Comment

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/posts/507f1f77bcf86cd799439012/comment/507f1f77bcf86cd799439015 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "author": { ... },
  "content": "Just launched my new project!",
  "likes": [],
  "comments": [],
  "likeCount": 0,
  "commentCount": 0,
  "createdAt": "2024-02-06T10:35:00.000Z",
  "updatedAt": "2024-02-06T10:46:00.000Z"
}
```

### 10. Delete Post

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/posts/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response (200):**
```json
{
  "message": "Post deleted"
}
```

## Using in Frontend (JavaScript/React)

### Example 1: Create Post
```javascript
import { postsAPI } from './services/api';

async function createPost() {
  try {
    const response = await postsAPI.createPost(
      "Hello World!",
      null,
      "All Posts"
    );
    console.log("Post created:", response.data);
  } catch (error) {
    console.error("Error:", error.response.data.message);
  }
}
```

### Example 2: Get All Posts with Filtering
```javascript
import { postsAPI } from './services/api';

async function getPosts() {
  try {
    const response = await postsAPI.getAllPosts("Most Liked", "likes");
    console.log("Posts:", response.data);
  } catch (error) {
    console.error("Error:", error);
  }
}
```

### Example 3: Like a Post
```javascript
import { postsAPI } from './services/api';

async function likePost(postId) {
  try {
    const response = await postsAPI.likePost(postId);
    console.log("Updated post:", response.data);
    // UI will show updated like count
  } catch (error) {
    console.error("Error:", error);
  }
}
```

### Example 4: Add Comment
```javascript
import { postsAPI } from './services/api';

async function addComment(postId, text) {
  try {
    const response = await postsAPI.addComment(postId, text);
    console.log("Comment added:", response.data);
  } catch (error) {
    console.error("Error:", error);
  }
}
```

## Error Responses

### 400 - Bad Request
```json
{
  "message": "All fields are required"
}
```

### 401 - Unauthorized
```json
{
  "message": "No token, authorization denied"
}
```

### 403 - Forbidden
```json
{
  "message": "Not authorized to delete this post"
}
```

### 404 - Not Found
```json
{
  "message": "Post not found"
}
```

### 409 - Conflict
```json
{
  "message": "User already exists with that email or username"
}
```

### 500 - Server Error
```json
{
  "message": "Server error",
  "error": "Error details..."
}
```

## Query Parameters

### Posts List
```
GET /api/posts?category=Most%20Liked&sortBy=likes

Parameters:
- category: "All Posts" | "For You" | "Most Liked" | "Most Commented" (optional)
- sortBy: "likes" | "comments" | undefined (newest) (optional)
```

## Testing with Postman

1. Create a new POST request to http://localhost:5000/api/auth/login
2. Add JSON body with email and password
3. Copy the token from response
4. For protected routes, click "Authorization" tab
5. Select "Bearer Token" and paste your token
6. Make requests to protected endpoints

## Important Notes

- **Token Expiration:** 7 days (set in backend auth.js)
- **Password Hashing:** bcryptjs with 10 salt rounds
- **Timestamps:** All dates in ISO 8601 format
- **Pagination:** Currently limited to 50 posts per request
- **Rate Limiting:** Not yet implemented (add for production)

## Common Issues

**401 Invalid Token**
- Token expired: Login again
- Token missing: Add Authorization header
- Token invalid: Check formatting

**CORS Errors**
- Check REACT_APP_API_BASE_URL
- Ensure backend is running
- Check backend CORS settings

**404 Post Not Found**
- Verify post ID is correct
- Post may have been deleted
- Check database connection

---

For more examples and advanced usage, see the codebase comments and implementation.
