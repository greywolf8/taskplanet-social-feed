# TaskPlanet - Social Feed App

A full-stack social media application built with React.js (frontend), Node.js + Express (backend), and MongoDB (database).

## Project Structure

```
├── backend/               # Node.js + Express server
│   ├── models/           # MongoDB schemas (User, Post)
│   ├── routes/           # API endpoints (auth, posts)
│   ├── middleware/       # Authentication middleware
│   ├── server.js         # Express server setup
│   ├── package.json
│   └── .env.example
│
├── frontend/             # React.js application
│   ├── public/          # Static files
│   ├── src/
│   │   ├── pages/       # Login, Signup, Feed pages
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Auth context
│   │   ├── services/    # API service calls
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
```

## Features

- **Authentication**: User signup and login with JWT tokens
- **Social Feed**: View posts from all users with real-time updates
- **Create Posts**: Share thoughts and content with the community
- **Like Posts**: React to posts instantly
- **Comments**: Add comments to posts with instant UI updates
- **Filter Posts**: Browse by categories (All Posts, For You, Most Liked, Most Commented)
- **Sort Posts**: Sort by newest, most liked, or most commented
- **Responsive Design**: Beautiful UI using CSS Modules inspired by TaskPlanet

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (Authentication)
- bcryptjs (Password hashing)
- CORS

### Frontend
- React.js
- React Router
- Axios
- CSS Modules

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your MongoDB URI and JWT secret:
   ```
   MONGO_URI=mongodb://localhost:27017/taskplanet
   JWT_SECRET=your_secret_key_here
   PORT=5000
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start the server:
   ```bash
   npm run dev
   ```
   The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your backend API URL (if different from localhost):
   ```
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start the development server:
   ```bash
   npm start
   ```
   The frontend will open on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Posts
- `GET /api/posts` - Get all posts (with filtering and sorting)
- `POST /api/posts` - Create a new post
- `GET /api/posts/:postId` - Get a specific post
- `DELETE /api/posts/:postId` - Delete a post
- `POST /api/posts/:postId/like` - Like/unlike a post
- `POST /api/posts/:postId/comment` - Add a comment to a post
- `DELETE /api/posts/:postId/comment/:commentId` - Delete a comment

## Usage

1. **Sign Up**: Create a new account on the signup page
2. **Login**: Log in with your credentials
3. **Create Post**: Use the create post section to share content
4. **Interact**: Like posts and add comments
5. **Filter & Sort**: Use tabs and dropdown to filter and sort posts
6. **Logout**: Click logout to end your session

## Database Schema

### User Collection
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  profilePicture: String,
  bio: String,
  followers: [ObjectId],
  following: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Post Collection
```javascript
{
  author: ObjectId (User reference),
  content: String,
  image: String,
  likes: [ObjectId],
  likeCount: Number,
  comments: [{
    author: ObjectId,
    text: String,
    createdAt: Date
  }],
  commentCount: Number,
  category: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Secure token storage in localStorage
- Protected routes (only authenticated users can create posts)
- Automatic token validation on API requests

## Future Enhancements

- User profiles and follow system
- Direct messaging
- Post images and media upload
- Search functionality
- Notifications system
- Admin dashboard
- Advanced analytics

## License

This project is open source and available under the MIT License.
