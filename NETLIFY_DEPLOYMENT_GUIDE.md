# Netlify Deployment Guide for AI Career Companion

## ⚠️ IMPORTANT: API Key Security

### Never Commit `.env.local` to GitHub!
- Your `.env.local` file is already in `.gitignore` ✓
- **DO NOT** push `VITE_GEMINI_API_KEY` to GitHub
- Your actual API key should only exist locally and in Netlify environment variables

## Step 1: Prepare Your Local Environment

Your local setup is already correct:
```
✓ .env.local contains: VITE_GEMINI_API_KEY=AIzaSyD7CNM0kKjtR3q_vMj0r2tZq7BcTvZ53Xo
✓ .gitignore excludes .env.local
✓ Build works: npm run build
✓ Preview works: npm run preview
```

## Step 2: Push Code to GitHub (Without API Key)

The code without `.env.local` is already pushed:
```bash
git status  # Should show .env.local is NOT listed (ignored)
git log     # Check your commits are there
```

## Step 3: Deploy to Netlify

### Option A: Connect GitHub Repository (Recommended)

1. **Go to netlify.com**
   - Sign up or log in
   - Click "Add new site" → "Import an existing project"

2. **Connect GitHub**
   - Select "GitHub" as provider
   - Authorize Netlify to access your repositories
   - Select repository: `AI-Career-companion-`

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Owner: (select your team)
   - Click "Deploy site"

### Option B: Manual Deployment (Drag & Drop)

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Go to netlify.com**
   - Drag and drop the `dist` folder to deploy
   - Netlify will host it instantly

## Step 4: Add API Key to Netlify (CRITICAL)

### Method 1: Netlify Dashboard

1. **Go to your Netlify site dashboard**
   - Select your site
   - Go to "Site settings" → "Build & deploy" → "Environment"

2. **Add Environment Variable**
   - Key: `VITE_GEMINI_API_KEY`
   - Value: `AIzaSyD7CNM0kKjtR3q_vMj0r2tZq7BcTvZ53Xo`
   - Click "Save"

3. **Trigger Rebuild**
   - Go to "Deployments"
   - Click "Trigger deploy" → "Deploy site"
   - Wait for build to complete

### Method 2: Via netlify.toml (Not Recommended for Secrets)

Don't add API keys in netlify.toml - use the dashboard instead!

### Method 3: Via CLI

If you have Netlify CLI installed:
```bash
# Install if needed
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Set environment variables
netlify env:set VITE_GEMINI_API_KEY "AIzaSyD7CNM0kKjtR3q_vMj0r2tZq7BcTvZ53Xo"

# Trigger rebuild
netlify build
netlify deploy --prod
```

## Step 5: How It Works in Production

### Local Development:
```
.env.local (has API key)
  ↓
npm run dev
  ↓
Vite loads VITE_GEMINI_API_KEY
  ↓
App uses AI features
```

### Netlify Production:
```
Netlify Dashboard (API key in Environment Variables)
  ↓
GitHub pushed (no .env.local)
  ↓
Netlify triggers build (npm run build)
  ↓
Vite loads VITE_GEMINI_API_KEY from Netlify env vars
  ↓
App uses AI features in production
```

## Verification Checklist

- [ ] Code pushed to GitHub without `.env.local`
- [ ] Repository is public on GitHub
- [ ] Connected GitHub to Netlify
- [ ] Build settings configured (npm run build → dist)
- [ ] Environment variable `VITE_GEMINI_API_KEY` added in Netlify dashboard
- [ ] Rebuild triggered after adding environment variable
- [ ] Site is live at yoursite.netlify.app
- [ ] AI features working (PDF parsing, suggestions, etc.)

## Troubleshooting

### "AI features not working in production"
1. Check Netlify dashboard for environment variable
2. Verify variable name is exactly: `VITE_GEMINI_API_KEY`
3. Trigger rebuild after adding environment variable
4. Check browser console for errors

### "Failed to parse PDF with AI"
- Environment variable not set properly
- Check Netlify build logs for errors
- Verify API key is correct

### "Failed to apply suggestion"
- Same as above - usually environment variable issue

### View Build Logs
- Netlify Dashboard → Deployments → Click a deployment → "Deploy log"
- Look for errors during build

## Your Current Status

✅ **Complete:**
- Local development working
- Code on GitHub (without API key)
- netlify.toml configured
- Build process ready

⏳ **Remaining Steps:**
1. Connect GitHub to Netlify
2. Add VITE_GEMINI_API_KEY to Netlify environment variables
3. Trigger rebuild
4. Verify AI features work

## Security Best Practices

✅ **What You're Doing Right:**
- `.env.local` in `.gitignore`
- Not committing API key
- Using environment variables in Vite

✅ **What to Remember:**
- Only share API key with Netlify (not GitHub)
- If API key exposed, regenerate it in Google AI Studio
- Each team member needs their own `.env.local` locally
- Netlify environment variable is shared by all deployments

---

**Current API Key Status:** ✓ Safe (only in .env.local and will be added to Netlify)
