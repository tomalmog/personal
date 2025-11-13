# Deployment Guide - Securing Your Chatbot

Your chatbot is now set up to use a serverless function that keeps your API key secure! Follow these steps to deploy.

## Option 1: Deploy to Netlify (Recommended - FREE)

### Step 1: Create Netlify Account
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub (easiest)

### Step 2: Deploy Your Site

**Method A: Drag & Drop (Easiest)**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag your entire `personal` folder onto the page
3. Wait for it to deploy (takes ~30 seconds)

**Method B: GitHub (Best for updates)**
1. Create a GitHub repository
2. Push your code:
   ```bash
   cd /Users/tomalmog/programming/personal
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. In Netlify, click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repository
5. Deploy!

### Step 3: Add Your API Key (IMPORTANT!)
1. In Netlify dashboard, go to your site
2. Click "Site configuration" → "Environment variables"
3. Click "Add a variable"
4. Name: `GROQ_API_KEY`
5. Value: `YOUR_GROQ_API_KEY_HERE` (get it from groq.com)
6. Click "Save"
7. Go to "Deploys" and click "Trigger deploy" → "Clear cache and deploy site"

### Step 4: Test Your Chatbot
1. Visit your live site (something like `your-site-name.netlify.app`)
2. Go to the About section
3. Open the chatbot
4. Ask a question!

## Option 2: Deploy to Vercel (Alternative)

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

### Step 2: Deploy
1. Click "Add New" → "Project"
2. Import your GitHub repository
3. Vercel will auto-detect settings
4. Click "Deploy"

### Step 3: Add Environment Variable
1. Go to your project settings
2. Click "Environment Variables"
3. Add `GROQ_API_KEY` with your API key
4. Redeploy

## Testing Locally (Optional)

If you want to test locally before deploying:

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. Add your API key to `.env`:
   ```
   GROQ_API_KEY=YOUR_GROQ_API_KEY_HERE
   ```

4. Run local server:
   ```bash
   netlify dev
   ```

5. Visit `http://localhost:8888`

## Security Notes

✅ **API Key is Now Secure**
- Your key is stored as an environment variable
- Not visible in your code
- Not exposed to website visitors
- Each request goes through your serverless function

✅ **Best Practices**
- Never commit `.env` files to GitHub (already in `.gitignore`)
- Regenerate your API key if it was ever public
- Set usage limits on Groq dashboard

## Troubleshooting

**Chatbot not working after deployment?**
1. Check if you added the `GROQ_API_KEY` environment variable
2. Make sure you redeployed after adding the variable
3. Check browser console for errors (F12)
4. Check Netlify function logs in dashboard

**"API error" messages?**
- Verify your API key is correct in environment variables
- Check if you have Groq API quota remaining
- Look at Netlify function logs for details

## Updating Your Site

When you make changes:

**Drag & Drop Method:**
- Just drag the folder again to Netlify drop page

**GitHub Method:**
```bash
git add .
git commit -m "Your update message"
git push
```
Netlify will auto-deploy!

## Custom Domain (Optional)

Want a custom domain instead of `yoursite.netlify.app`?

1. Buy a domain (Namecheap, Google Domains, etc.)
2. In Netlify: "Domain management" → "Add custom domain"
3. Follow the DNS setup instructions
4. Free HTTPS included!

---

Need help? The chatbot should work immediately after following Step 3!
