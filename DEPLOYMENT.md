# TaskPlanet - Deployment Guide

## Deploy Backend

### Option 1: Deploy to Heroku

1. **Create Heroku Account** - Sign up at heroku.com
2. **Install Heroku CLI** - Download from heroku.com/downloads
3. **Login to Heroku**
   ```bash
   heroku login
   ```

4. **Create Heroku App**
   ```bash
   cd backend
   heroku create taskplanet-api
   ```

5. **Add MongoDB Atlas URI**
   - Create account at mongodb.com/cloud/atlas
   - Create a cluster and get connection string
   - Set environment variables:
   ```bash
   heroku config:set MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/taskplanet
   heroku config:set JWT_SECRET=your_production_secret_key
   heroku config:set NODE_ENV=production
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

7. **View Logs**
   ```bash
   heroku logs --tail
   ```

### Option 2: Deploy to Railway

1. **Create Railway Account** - Sign up at railway.app
2. **Connect GitHub Repository** - In Railway dashboard
3. **Add Environment Variables**
   - Set MONGO_URI, JWT_SECRET, NODE_ENV
4. **Deploy** - Railway auto-deploys on git push

### Option 3: Deploy to Render

1. **Create Render Account** - Sign up at render.com
2. **Create New Web Service**
3. **Connect to GitHub**
4. **Set Environment Variables**
5. **Deploy**

## Deploy Frontend

### Option 1: Deploy to Vercel

1. **Create Vercel Account** - Sign up at vercel.com
2. **Import Project**
   - Connect your GitHub repository
   - Select `frontend` directory as root
3. **Set Environment Variables**
   ```
   REACT_APP_API_BASE_URL=https://taskplanet-api.herokuapp.com/api
   ```
4. **Deploy** - Vercel auto-deploys on git push

### Option 2: Deploy to Netlify

1. **Create Netlify Account** - Sign up at netlify.com
2. **Build Settings**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `build`
3. **Set Environment Variables** - Add in Netlify dashboard
4. **Deploy**

### Option 3: Deploy to GitHub Pages

1. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/taskplanet"
   }
   ```

2. **Install gh-pages**
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

3. **Update package.json scripts**
   ```json
   {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

## Production Checklist

### Backend
- [ ] Use strong JWT_SECRET (not default)
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas (cloud DB)
- [ ] Enable CORS for your frontend URL
- [ ] Set up error logging
- [ ] Use HTTPS
- [ ] Monitor server logs

### Frontend
- [ ] Update REACT_APP_API_BASE_URL to production backend
- [ ] Build optimized production bundle
- [ ] Test all features in production
- [ ] Set up analytics
- [ ] Enable HTTPS
- [ ] Optimize images

## Update CORS Settings

In `backend/server.js`, update CORS for production:

```javascript
app.use(cors({
  origin: "https://your-frontend-url.com",
  credentials: true
}));
```

## Database Backup

### MongoDB Atlas
- Automatic daily backups included
- Can restore from snapshots
- Export data as JSON/BSON

### Manual Backup
```bash
mongodump --uri "mongodb+srv://user:password@cluster.mongodb.net/taskplanet" --out ./backup
```

## Monitoring & Logging

### Heroku
- View logs: `heroku logs --tail`
- Set up alerts in dashboard

### Sentry (Error Tracking)
1. Sign up at sentry.io
2. Add to backend: `npm install sentry`
3. Configure in server.js
4. Get real-time error alerts

## Performance Tips

### Backend
- Add caching for posts
- Implement pagination
- Use database indexes
- Compress responses

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Minification

## Security Best Practices

1. **Secrets Management**
   - Never commit .env files
   - Use environment variables
   - Rotate JWT_SECRET periodically

2. **Data Protection**
   - Hash passwords (already implemented)
   - Validate all inputs
   - Use HTTPS only
   - Implement rate limiting

3. **Database Security**
   - Use MongoDB connection string with authentication
   - Restrict IP access if possible
   - Regular backups

## Scaling Considerations

- Add Redis for caching
- Implement CDN for static files
- Database indexing strategy
- Load balancing for multiple servers
- Consider microservices architecture

## Troubleshooting Deployment

**502 Bad Gateway**
- Check backend is running
- Verify environment variables
- Check database connection

**CORS Errors**
- Update CORS settings in backend
- Verify frontend URL in CORS config
- Check REACT_APP_API_BASE_URL

**Database Connection Issues**
- Verify MongoDB URI
- Check IP whitelist in MongoDB Atlas
- Ensure network access

**Build Failures**
- Check Node version compatibility
- Clear node_modules and reinstall
- Check for environment variable issues

## Useful Commands

```bash
# Backend deployment check
curl https://your-api-url.herokuapp.com/api/health

# Frontend build optimization
cd frontend && npm run build

# Production server start
cd backend && NODE_ENV=production npm start

# Database stats
mongosh "mongodb+srv://..." --eval "db.posts.countDocuments()"
```

## Continuous Integration/Deployment (CI/CD)

Create `.github/workflows/deploy.yml` for automatic deployment:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: cd backend && npm install && npm test
      - run: cd frontend && npm install && npm run build
```

## Support & Resources

- Heroku Docs: devcenter.heroku.com
- Vercel Docs: vercel.com/docs
- MongoDB Atlas: docs.atlas.mongodb.com
- GitHub Actions: github.com/features/actions
