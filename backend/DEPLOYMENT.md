# TaskPlanet Backend Deployment Guide

## 🚀 Deploy to Render

### Prerequisites
1. **MongoDB Atlas Account**: Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Render Account**: Create a free account at [render.com](https://render.com)
3. **GitHub Repository**: Push your code to GitHub

### Step 1: Setup MongoDB Atlas

1. **Create Cluster**:
   - Go to MongoDB Atlas Dashboard
   - Click "Build a Database"
   - Choose "M0 Sandbox" (free tier)
   - Select a cloud provider and region closest to your users

2. **Configure Network Access**:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for Render deployment
   - Or add Render's IP ranges for better security

3. **Create Database User**:
   - Go to "Database Access" → "Add New Database User"
   - Enter username and strong password
   - Grant "Read and write to any database" permissions

4. **Get Connection String**:
   - Go to "Database" → "Connect" → "Drivers"
   - Copy the connection string
   - Replace `<password>` with your user password
   - Replace `<dbname>` with `taskplanet`

### Step 2: Setup Render

1. **Create Web Service**:
   - Go to Render Dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the backend folder or root repository

2. **Configure Service**:
   ```yaml
   Name: taskplanet-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

3. **Environment Variables**:
   Add these environment variables in Render Dashboard:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskplanet?retryWrites=true&w=majority
   JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters_long
   NODE_ENV=production
   PORT=5000
   ```

### Step 3: Deploy

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Configure for production deployment"
   git push origin main
   ```

2. **Automatic Deployment**:
   - Render will automatically detect changes
   - Build and deployment will start
   - Monitor logs in Render Dashboard

### Step 4: Verify Deployment

1. **Health Check**:
   - Visit `https://your-app-name.onrender.com/api/health`
   - Should return: `{"status":"Server is running","timestamp":"...","environment":"production"}`

2. **Test API Endpoints**:
   - Test authentication endpoints
   - Test posts endpoints
   - Check MongoDB connection in logs

## 📝 Environment Variables

### Required Variables:
- `MONGO_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Secure secret for JWT tokens (min 32 characters)
- `NODE_ENV`: Set to "production"
- `PORT`: Server port (default: 5000)

### Optional Variables:
- `FRONTEND_URL`: Your frontend domain for CORS

## 🔧 Troubleshooting

### Common Issues:

1. **MongoDB Connection Failed**:
   - Check IP whitelist in MongoDB Atlas
   - Verify connection string format
   - Ensure username/password are correct

2. **CORS Errors**:
   - Update allowed origins in server.js
   - Add your frontend domain to CORS configuration

3. **Build Failures**:
   - Check package.json dependencies
   - Ensure Node.js version compatibility
   - Review build logs in Render

4. **Memory Issues**:
   - Free tier has limited memory
   - Optimize database queries
   - Consider upgrading to paid plan

### Monitoring:
- Check Render logs for errors
- Monitor MongoDB Atlas metrics
- Set up alerts for downtime

## 🛡️ Security Best Practices

1. **Environment Variables**:
   - Never commit `.env` files
   - Use strong, unique secrets
   - Rotate keys regularly

2. **Database Security**:
   - Use IP whitelisting
   - Enable authentication
   - Regular backups

3. **API Security**:
   - Rate limiting
   - Input validation
   - HTTPS only

## 📊 Scaling

### Free Tier Limitations:
- 750 hours/month
- 512MB RAM
- Shared CPU
- Sleeps after 15 minutes inactivity

### Upgrade Options:
- **Starter**: $7/month - No sleep, better performance
- **Standard**: $25/month - More resources, dedicated CPU
- **Production**: Custom - High availability, scaling

## 🔄 CI/CD Pipeline

Your deployment pipeline:
```
Git Push → Render Build → Deploy → Health Check → Live
```

Automatic deployments are enabled. To disable:
- Go to Render Dashboard → Service → Settings
- Toggle "Auto-Deploy" off
