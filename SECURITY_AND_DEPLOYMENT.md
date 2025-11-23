# Quick Reference: API Key Management

## Should You Add API Key to `.env` File Before Pushing to GitHub?

### ❌ NO - NEVER DO THIS:
```
.env or .env.local with VITE_GEMINI_API_KEY=AIzaSyD...
                    ↓
              git add .
                    ↓
              git push origin main
                    ↓
          ❌ API KEY EXPOSED ON PUBLIC GITHUB!
```

### ✅ YES - DO THIS INSTEAD:
```
Local Machine:
  .env.local (in .gitignore) → API key stays local only
         ↓
     git push → No .env.local in GitHub ✓
         ↓
    GitHub is public but SAFE (no secrets)

Netlify Deployment:
  Netlify Dashboard → Set environment variable
         ↓
  VITE_GEMINI_API_KEY = AIzaSyD...
         ↓
  Netlify build uses this variable
         ↓
  App works in production ✓
```

## File Status Check

### Your `.gitignore` (should have this):
```
.env.local          ← Your API key file stays LOCAL
node_modules
dist
.DS_Store
```

### What's on GitHub:
```
✓ All code files (App.tsx, services/, components/, etc.)
✓ package.json
✓ netlify.toml
✓ tsconfig.json
✗ .env.local (NOT pushed - safe!)
```

### What's on Netlify:
```
Netlify Environment Variables (Secure Dashboard):
  VITE_GEMINI_API_KEY = AIzaSyD7CNM0kKjtR3q_vMj0r2tZq7BcTvZ53Xo
```

## How to Set API Key on Netlify (Step by Step)

### 1. Log in to Netlify
- Go to https://app.netlify.com
- Click your site

### 2. Go to Environment Variables
```
Site Settings (top menu)
    ↓
Build & deploy (left sidebar)
    ↓
Environment (section)
    ↓
Add environment variable
```

### 3. Add Your Key
```
Key:   VITE_GEMINI_API_KEY
Value: AIzaSyD7CNM0kKjtR3q_vMj0r2tZq7BcTvZ53Xo
       ↑ (your actual key from Google AI Studio)

Click: Save
```

### 4. Redeploy
```
Deployments (top menu)
    ↓
Trigger deploy
    ↓
Deploy site
    ↓
Wait for build to complete (2-3 minutes)
```

### 5. Verify It Works
```
Open your site URL
    ↓
Try AI feature (upload resume, get suggestion)
    ↓
Check browser console for errors (F12)
```

## Why This Setup Works

```
Vite Build Process:
  1. Vite looks for variables starting with VITE_
  2. In local: reads from .env.local
  3. In production (Netlify): reads from dashboard env vars
  4. Replaces import.meta.env.VITE_GEMINI_API_KEY with actual value
  5. API key is BAKED into the final build
```

## Common Mistakes to Avoid

❌ **Don't:**
- Commit .env.local to GitHub
- Add API key directly in netlify.toml
- Share API key in Discord/email
- Use same key across multiple apps

✅ **Do:**
- Keep .env.local in .gitignore
- Use Netlify dashboard for secrets
- Regenerate key if ever exposed
- Use different keys for different projects

## Quick Test Commands

```bash
# Check if .env.local is ignored
git status              # Should NOT show .env.local

# Check if build works locally
npm run build          # Should work

# Check if preview works
npm run preview        # Visit http://localhost:4173

# Check GitHub has no secrets
git log --oneline      # View commits
cd dist && ls -la      # Verify build output
```

## If Something Goes Wrong on Netlify

### Error: "AI features not working"
1. Check Netlify environment variable is set
2. Variable name must be EXACTLY: `VITE_GEMINI_API_KEY`
3. Trigger rebuild after changing variables
4. Check deploy logs for build errors

### Error: "Failed to parse PDF"
→ API key not available during build/runtime

### Error: "Permission denied" or "Unauthorized"
→ API key is wrong or expired, regenerate from Google AI Studio

### How to Check Build Logs
```
Netlify Dashboard
    ↓
Deployments
    ↓
Click on latest deployment
    ↓
"Deploy log" tab
    ↓
Look for errors or VITE_GEMINI_API_KEY messages
```

---

**Your Current Setup:** ✅ Correct!
- .env.local is local only
- Code is on GitHub without secrets
- Ready to add API key to Netlify dashboard
