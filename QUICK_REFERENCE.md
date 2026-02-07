# TaskPlanet - Quick Reference Card

## Start Here (30 seconds)

```bash
# Terminal 1: Start Backend
cd backend && npm install && npm run dev

# Terminal 2: Start Frontend
cd frontend && npm install && npm start

# Open http://localhost:3000 and sign up!
```

## Folder Structure

```
backend/              ← Node.js server
├── server.js        ← Main server file
├── models/          ← Database schemas
├── routes/          ← API endpoints
└── middleware/      ← JWT auth

frontend/            ← React app
├── src/
│   ├── pages/       ← Login, Signup, Feed
│   ├── components/  ← Reusable components
│   ├── context/     ← State management
│   ├── services/    ← API calls
│   └── App.js       ← Main app
└── public/          ← Static files
```

## Key Commands

```bash
# Backend
cd backend
npm install          # Install dependencies
npm run dev          # Start with auto-reload
npm start            # Start production

# Frontend
cd frontend
npm install          # Install dependencies
npm start            # Start dev server
npm run build        # Build for production
npm test             # Run tests
```

## Environment Setup

**backend/.env**
```
MONGO_URI=mongodb://localhost:27017/taskplanet
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
```

**frontend/.env**
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

## API Endpoints Cheat Sheet

```
Auth:
  POST   /api/auth/signup          Create account
  POST   /api/auth/login            Login
  GET    /api/auth/me               Current user

Posts:
  GET    /api/posts                 List all posts
  GET    /api/posts?category=...    Filter by category
  GET    /api/posts?sortBy=likes    Sort posts
  POST   /api/posts                 Create post
  DELETE /api/posts/:id             Delete post
  POST   /api/posts/:id/like        Like post
  POST   /api/posts/:id/comment     Add comment
  DELETE /api/posts/:id/comment/:id Delete comment
```

## Component Map

```
App.js
├── LoginPage
├── SignupPage
└── Feed
    ├── Header
    ├── CreatePost
    ├── FilterTabs
    └── PostCard (repeated)
        ├── Like Button
        └── Comments Section
```

## Database Collections

**Users**
```javascript
{
  username, email, password (hashed),
  profilePicture, bio, followers, following
}
```

**Posts**
```javascript
{
  author (User ID), content, image,
  likes (User IDs), comments, likeCount,
  commentCount, category, createdAt
}
```

## Common Tasks

### Create a Post
1. User types in textarea
2. Click "Post" button
3. API call sent with content
4. Response updates feed
5. New post appears at top

### Like a Post
1. Click heart icon
2. API call sent
3. Like count updated
4. Heart fills in red
5. UI updates instantly

### Add Comment
1. Click comment button
2. Comment box appears
3. Type comment
4. Click "Post"
5. Comment shows immediately

### Filter Posts
1. Click filter tab (All Posts, For You, etc.)
2. API call with filter param
3. Feed updates
4. Shows only filtered posts

### Sort Posts
1. Select from dropdown
2. Choose: Newest, Most Liked, Most Commented
3. API call with sortBy param
4. Feed re-orders
5. Shows sorted posts

## Authentication Flow

```
Signup Form
    ↓ (submit)
API /auth/signup
    ↓ (response)
Save token to localStorage
    ↓
Set user in context
    ↓
Redirect to Feed
    ↓
Add token to every request header
```

## State Management

**AuthContext provides:**
- `user` - Current user object
- `loading` - Loading state
- `login()` - Login function
- `signup()` - Signup function
- `logout()` - Logout function

**Usage in components:**
```javascript
const { user, login, logout } = useContext(AuthContext);
```

## Styling Strategy

Each component has its own `.module.css` file:
```
Header.js + Header.module.css
CreatePost.js + CreatePost.module.css
PostCard.js + PostCard.module.css
```

**CSS Variables (in index.css):**
```css
--primary-blue: #1e88e5
--primary-dark: #0d47a1
--accent-orange: #ff9100
--text-primary: #000
--text-secondary: #666
--bg-light: #ffffff
--bg-gray: #f0f2f5
--border-color: #e0e0e0
```

## Error Handling

**Backend errors:**
- 400: Bad request (validation)
- 401: Unauthorized (no token/invalid)
- 403: Forbidden (not authorized)
- 404: Not found (post/user)
- 409: Conflict (user exists)
- 500: Server error

**Frontend handling:**
- Catch API errors
- Show user-friendly message
- Log to console for debugging
- Don't lose user data

## Testing Features

**Test Account:**
```
Username: testuser
Email: test@example.com
Password: password123
```

**Test Scenarios:**
1. Sign up new account
2. Create post with text
3. Like own post → count increases
4. Add comment → shows immediately
5. Delete comment → disappears
6. Filter posts → changes feed
7. Sort posts → reorders
8. Logout → redirect to login
9. Login → see feed again

## Debugging Tips

```javascript
// In component console:
console.log("[v0] Component rendered with props:", props);
console.log("[v0] API response:", response.data);
console.log("[v0] Current state:", currentState);

// Check token:
localStorage.getItem("token")

// Clear token:
localStorage.removeItem("token")

// API test:
fetch("http://localhost:5000/api/posts")
  .then(r => r.json())
  .then(d => console.log(d))
```

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Backend won't start | Check MongoDB is running |
| CORS error | Check REACT_APP_API_BASE_URL |
| 401 errors | Token expired, login again |
| Posts not showing | Check API is returning data |
| Styles not applying | Check CSS Module import |
| Can't create post | Check if logged in |
| Comments not saving | Check network tab for errors |

## File Locations

```
To change:
- Colors → src/index.css (--primary-blue, etc.)
- API URL → frontend/.env (REACT_APP_API_BASE_URL)
- Database → backend/.env (MONGO_URI)
- JWT secret → backend/.env (JWT_SECRET)
- Port → backend/.env (PORT)
```

## Performance Checklist

- [x] No unnecessary re-renders
- [x] API calls optimized
- [x] Images optimized
- [x] CSS minified
- [x] Bundle size good
- [x] Mobile responsive
- [x] Fast interactions
- [x] No console errors

## Browser DevTools Tips

**React Components tab:**
- Inspect component props
- Check state values
- Trigger events manually

**Network tab:**
- Monitor API requests
- Check response times
- Verify headers

**Console tab:**
- See error messages
- Use console.log
- Test API with fetch

## Deployment Checklist

Before deploying:
- [ ] Test all features locally
- [ ] Update environment variables
- [ ] Change JWT_SECRET
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas
- [ ] Update frontend API URL
- [ ] Test on staging
- [ ] Check security

## Support References

```
Frontend issues → Check src/ folders
Backend issues → Check backend/ folder
Database issues → Check MongoDB logs
Auth issues → Check middleware/auth.js
API issues → Check routes/ folder
Styling issues → Check .module.css files
```

## Next Features to Add

- [ ] User profiles
- [ ] Follow/unfollow
- [ ] Direct messages
- [ ] Image uploads
- [ ] Search posts
- [ ] Notifications
- [ ] Real-time updates
- [ ] Admin dashboard

## Production Deployment

```bash
# Backend → Heroku/Railway/Render
# Frontend → Vercel/Netlify
# Database → MongoDB Atlas

See DEPLOYMENT.md for full guide
```

---

**Remember:** 
- Start simple
- Test thoroughly
- Deploy with confidence
- Add features incrementally
- Keep code clean

**Need help?** Check the docs in the root folder!
