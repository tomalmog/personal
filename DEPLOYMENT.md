# Deployment Guide - Vercel

This guide will help you deploy your RPG portfolio to Vercel with the AI chatbot functionality.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Your Groq API key

## Deployment Steps

### 1. Push to GitHub

Make sure your code is pushed to GitHub:

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect settings - no configuration needed!
5. Click "Deploy"

### 3. Add Environment Variable

After deployment:

1. Go to your project dashboard on Vercel
2. Click "Settings" → "Environment Variables"
3. Add a new variable:
   - **Name**: `GROQ_API_KEY`
   - **Value**: Your Groq API key
   - **Environment**: Production (and optionally Preview/Development)
4. Click "Save"

### 4. Redeploy

After adding the environment variable:

1. Go to "Deployments" tab
2. Click the three dots on the latest deployment
3. Click "Redeploy"

Your site should now be live with a working chatbot! 🎉

## Local Development (Optional)

To test locally with Vercel CLI:

```bash
# Install Vercel CLI globally
npm install -g vercel

# Create .env file with your API key
echo "GROQ_API_KEY=your_api_key_here" > .env

# Run local dev server
vercel dev
```

This will start a local server at http://localhost:3000

## File Structure

```
.
├── api/
│   └── chat.js          # Serverless function for chatbot
├── index.html           # Main HTML file
├── styles.css           # Styles
├── script.js            # Interactive elements
├── routing.js           # Client-side routing
├── chatbot.js           # Chatbot functionality
├── vercel.json          # Vercel configuration
└── .env                 # Local environment variables (not committed)
```

## Troubleshooting

### Chatbot not working
- Check that `GROQ_API_KEY` is set in Vercel environment variables
- Check browser console for errors
- Verify the deployment succeeded

### Routes not working (404s)
- Make sure `vercel.json` exists and contains the rewrite rules
- Redeploy the project

### API errors
- Check Vercel function logs in the dashboard
- Verify your Groq API key is valid and has quota remaining

## Custom Domain (Optional)

To add a custom domain:

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your domain and follow DNS setup instructions

## Notes

- Vercel's free tier includes:
  - 100GB bandwidth per month
  - Unlimited serverless function invocations
  - Automatic HTTPS
  - Global CDN
- Environment variables are encrypted and secure
- Automatic deployments on every git push

## Updating Your Site

When you make changes:

```bash
git add .
git commit -m "Your update message"
git push
```

Vercel will automatically deploy your changes!
