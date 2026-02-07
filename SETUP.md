# TaskPlanet Setup Guide

## Quick Start (5 minutes)

### 1. Start MongoDB
Make sure MongoDB is running locally or update the `MONGO_URI` in `backend/.env`

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env if needed (default settings work for local dev)
npm run dev
```
✓ Backend running at `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm start
```
✓ Frontend opens at `http://localhost:3000`

## Account Creation & Testing

1. Go to http://localhost:3000
2. Click "Sign up here" and create an account
3. Create a new post using the "Create Post" section
4. Like posts and add comments
5. Use filters to browse posts by category
6. Sort posts by newest, most liked, or most commented

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/taskplanet
JWT_SECRET=your_secret_key_change_in_production
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

## Project Features

✓ User Authentication (Signup/Login)
✓ Create, Read, Delete Posts
✓ Like/Unlike Posts (Instant UI update)
✓ Add/Delete Comments (Instant UI update)
✓ Filter Posts by Category
✓ Sort Posts (Newest, Most Liked, Most Commented)
✓ User Profiles
✓ Responsive Design
✓ JWT Token-based Security

## Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running: `mongod`
- Check MONGO_URI is correct in .env

**CORS Error**
- Ensure backend is running on port 5000
- Check REACT_APP_API_BASE_URL in frontend/.env

**Port Already in Use**
- Backend: Change PORT in backend/.env
- Frontend: Will automatically use next available port

**Token Expired**
- Clear localStorage and login again
- JWT tokens expire in 7 days

## API Testing

Use Postman or cURL to test endpoints:

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@email.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@email.com","password":"password123"}'

# Create Post (requires token)
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"content":"Hello World!"}'

# Get All Posts
curl http://localhost:5000/api/posts

# Like Post
curl -X POST http://localhost:5000/api/posts/POST_ID/like \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## File Structure Overview

```
backend/
├── models/User.js          # User schema
├── models/Post.js          # Post & Comment schemas
├── middleware/auth.js      # JWT authentication
├── routes/auth.js          # Auth endpoints
├── routes/posts.js         # Posts CRUD & interactions
├── server.js               # Express server
└── .env.example            # Environment template

frontend/
├── src/
│   ├── pages/
│   │   ├── Login.js        # Login page
│   │   ├── Signup.js       # Signup page
│   │   └── Feed.js         # Main social feed
│   ├── components/
│   │   ├── Header.js       # Top navigation
│   │   ├── CreatePost.js   # Post creation form
│   │   ├── FilterTabs.js   # Category filters
│   │   └── PostCard.js     # Individual post display
│   ├── context/AuthContext.js  # Auth state management
│   ├── services/api.js     # API calls
│   └── index.css           # Global styles
└── public/index.html       # HTML template
```

## Next Steps

- Add user profile pages
- Implement follow/unfollow system
- Add image upload for posts
- Add notifications system
- Deploy to production (Vercel, Heroku, etc.)

## Support

For issues or questions, check:
1. Console errors (browser DevTools)
2. Backend logs (terminal)
3. MongoDB connection
4. CORS settings
