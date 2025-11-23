# Netlify Deployment Checklist

## Pre-Deployment (Local Setup) ✅ DONE

- [x] `.env.local` file created with `VITE_GEMINI_API_KEY`
- [x] `.gitignore` includes `*.local` (protects `.env.local`)
- [x] `npm run build` works locally
- [x] `npm run preview` shows app with styling
- [x] Code pushed to GitHub (without `.env.local`)
- [x] `netlify.toml` created with build configuration
- [x] All AI services configured for `gemini-2.5-flash`

## Netlify Setup Steps (DO THIS NOW)

### Step 1: Connect GitHub to Netlify
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" as your Git provider
4. Select repository: `SharanMadhavan/AI-Career-companion-`
5. Click "Connect"

### Step 2: Configure Build Settings
```
Build command:   npm run build
Publish directory: dist
```
(These are auto-detected if netlify.toml exists)

### Step 3: Add API Key Environment Variable
1. After site is created, go to "Site settings"
2. Navigate to "Build & deploy" → "Environment"
3. Click "Add environment variable"
4. Enter:
   - Key: `VITE_GEMINI_API_KEY`
   - Value: `AIzaSyD7CNM0kKjtR3q_vMj0r2tZq7BcTvZ53Xo`
5. Click "Save"

### Step 4: Trigger Initial Deploy
1. Go to "Deployments" tab
2. Click "Trigger deploy" → "Deploy site"
3. Wait for deployment to complete (~2-3 minutes)

### Step 5: Verify Deployment
1. Visit your Netlify URL (e.g., https://ai-career-companion.netlify.app)
2. Try an AI feature:
   - Upload a resume → AI should parse it
   - Enter a job description → AI should generate suggestions
   - Start mock interview → AI should respond
3. Open browser console (F12) and check for errors

## What NOT To Do

❌ Don't add `.env.local` to GitHub
❌ Don't commit your API key to any file
❌ Don't share your API key in Discord/Slack
❌ Don't hardcode the API key in the code

## Security Rules

✅ API key only in:
- Local `.env.local` file (not committed)
- Netlify Environment Variables dashboard

✅ GitHub contains:
- All code files
- netlify.toml
- tsconfig.json, package.json, etc.
- NO secrets, NO API keys

## Testing AI Features

After deployment, test each feature:

### 1. Resume Parser
- Upload a PDF resume
- Should extract text using AI
- Display on page

### 2. Suggestion Generator
- Write a job description
- Get AI suggestions
- Display recommendations

### 3. Resume Tailor
- Upload resume
- Enter job description
- Get tailored bullets

### 4. Interview Prep
- Enter role and questions
- Get interview preparation tips

### 5. Mock Interview
- Start mock interview
- Get AI-generated questions
- Receive feedback

## Troubleshooting

### AI Features Not Working
1. Check Netlify environment variable: `VITE_GEMINI_API_KEY` is set
2. Verify variable value is correct
3. Trigger rebuild: Deployments → Trigger deploy → Deploy site
4. Check build logs for errors

### Build Fails
1. Go to Deployments
2. Click latest deployment
3. Click "Deploy log" tab
4. Look for error messages
5. Check if `npm run build` works locally

### Still Not Working?
1. Check browser console (F12) for JavaScript errors
2. Check Network tab for failed API calls
3. Verify API key hasn't been disabled
4. Try generating new API key from Google AI Studio

## Important URLs

- Netlify Admin: https://app.netlify.com
- Your Site: https://your-site-name.netlify.app
- Google AI Studio: https://aistudio.google.com
- GitHub Repo: https://github.com/SharanMadhavan/AI-Career-companion-

## After Everything Works

1. Share your deployed URL
2. Test all features with real data
3. Monitor Netlify for any build failures
4. Consider upgrading to a custom domain later

---

**Status:** Ready for Netlify deployment!
**Next Action:** Follow "Netlify Setup Steps" above
