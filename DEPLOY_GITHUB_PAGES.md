# 🚀 Deploy to GitHub Pages + Railway

This guide will help you deploy your Advanced Health Assistant to GitHub Pages (frontend) and Railway (backend) for a fully working live website.

## 🌐 Live URLs After Deployment

- **Frontend**: `https://vatsalkc.github.io/advance-health-assistant/`
- **Backend**: `https://advance-health-assistant-backend.railway.app/`
- **Full App**: Users access the frontend URL

## 📋 Step-by-Step Deployment

### Step 1: Deploy Backend to Railway (5 minutes)

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up** with your GitHub account
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose** `vatsalkc/advance-health-assistant`
6. **Railway will automatically**:
   - Detect Python backend
   - Install dependencies
   - Train ML model
   - Deploy backend
7. **Your backend will be live** at: `https://advance-health-assistant-backend.railway.app`

### Step 2: Enable GitHub Pages (2 minutes)

1. **Go to your GitHub repository**: `https://github.com/vatsalkc/advance-health-assistant`
2. **Click "Settings"** tab
3. **Scroll to "Pages"** section
4. **Source**: Select "GitHub Actions"
5. **Click "Save"**

### Step 3: Automatic Deployment

The GitHub Action will automatically:
- ✅ Build your React app
- ✅ Configure it to use Railway backend
- ✅ Deploy to GitHub Pages
- ✅ Your site will be live at: `https://vatsalkc.github.io/advance-health-assistant/`

## 🎯 What Users Will Get

### ✅ Full Functionality
- **AI Disease Prediction**: 216 diseases, 613 symptoms
- **Doctor Appointments**: 100+ doctors, booking system
- **Medicine Reminders**: Personal medication management
- **Health Dashboard**: Complete health overview
- **Multi-device Access**: Desktop and mobile

### ✅ Professional Features
- **Real Backend**: SQLite database, JWT authentication
- **ML Model**: Trained Random Forest classifier
- **Responsive Design**: Works on all devices
- **Secure**: Password hashing, token authentication

## 🔧 Configuration

### Environment Variables (Automatic)
- **Frontend**: Configured to use Railway backend
- **Backend**: Uses Railway's PORT environment variable
- **Database**: SQLite (automatically created)
- **ML Model**: Trained on deployment

### Custom Domain (Optional)
You can add a custom domain in GitHub Pages settings:
1. Go to repository Settings > Pages
2. Add your custom domain
3. Enable HTTPS

## 🚀 Deployment Status

Check deployment status:
- **GitHub Actions**: Repository > Actions tab
- **Railway**: Railway dashboard
- **Live Site**: Visit your GitHub Pages URL

## 🔄 Updates

To update your live site:
1. **Make changes** to your code
2. **Push to main branch**: `git push origin main`
3. **Automatic deployment** will trigger
4. **Site updates** in 2-3 minutes

## 🆘 Troubleshooting

### Common Issues:

1. **GitHub Pages not working**:
   - Check Actions tab for build errors
   - Ensure Pages is enabled in Settings

2. **Backend not responding**:
   - Check Railway logs in dashboard
   - Verify backend URL in frontend

3. **CORS errors**:
   - Backend is already configured for CORS
   - Should work automatically

## 📊 Monitoring

### GitHub Pages
- **Analytics**: Available in repository Insights
- **Uptime**: 99.9% (GitHub's infrastructure)
- **SSL**: Automatic HTTPS

### Railway Backend
- **Monitoring**: Available in Railway dashboard
- **Logs**: Real-time logging
- **Metrics**: CPU, memory, requests

## 💰 Cost

- **GitHub Pages**: Free (public repositories)
- **Railway**: Free tier (500 hours/month)
- **Total Cost**: $0/month

## 🎉 Success!

Once deployed, your Advanced Health Assistant will be:
- ✅ **Live and accessible** worldwide
- ✅ **Fully functional** with AI and database
- ✅ **Professional quality** for portfolio
- ✅ **Mobile responsive** for all devices
- ✅ **Automatically updated** on code changes

Share your live URL with anyone: `https://vatsalkc.github.io/advance-health-assistant/`

## 🔗 Quick Deploy Links

- **Railway Backend**: [Deploy to Railway](https://railway.app/new/template?template=https://github.com/vatsalkc/advance-health-assistant)
- **GitHub Pages**: Automatic (just enable in Settings)

Your health assistant will be live and ready to use! 🌟