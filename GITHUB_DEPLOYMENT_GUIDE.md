# GitHub & Vercel Deployment Guide

## 🚀 Step 1: Push to GitHub

### Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. **Repository name**: `netflix-clone`
3. **Description**: "A Netflix-like streaming platform built with Next.js, Supabase, and TMDB API"
4. Choose **Public** (so others can see it)
5. **DO NOT** initialize with README, .gitignore, or license (we already have them)
6. Click **Create repository**

### Push Your Code

Copy the HTTPS URL from your new repo, then run these commands:

```powershell
cd "s:\Netflix Clone"

# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/netflix-clone.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

**You're done!** Your code is now on GitHub. Visit `https://github.com/YOUR_USERNAME/netflix-clone` to view it.

---

## 🌐 Step 2: Deploy on Vercel

### Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (easiest method)
3. Authorize Vercel to access your GitHub account

### Deploy the Project

1. After signing in, click **Add New...** → **Project**
2. Find and click **netflix-clone** repository
3. Click **Import** (no need to change anything)
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_TMDB_API_KEY` = your TMDB API key
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
5. Click **Deploy**

**Wait 2-3 minutes** for deployment to complete. Vercel will give you a live URL!

### Auto-Deploy on Push

Now whenever you push code to GitHub:
```bash
git add .
git commit -m "Your changes"
git push
```

Vercel will automatically rebuild and deploy your changes. No extra steps needed!

---

## 📝 Environment Variables for Vercel

Make sure these match your `.env.local`:

| Variable | Where to Get | 
|----------|-------------|
| `NEXT_PUBLIC_TMDB_API_KEY` | [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) |
| `NEXT_PUBLIC_SUPABASE_URL` | [supabase.com/dashboard](https://supabase.com/dashboard) → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same as above → Anon/Public key |

---

## ✅ Verify Deployment

1. Go to your Vercel project dashboard
2. Click the live deployment URL
3. You should see your Netflix Clone live online!

**Share it with friends:**
```
https://netflix-clone-YOUR_USERNAME.vercel.app
```

---

## 🔄 Updating Your Project

To make changes and push them:

```bash
# Make your changes in VS Code

# Stage changes
git add .

# Commit with a message
git commit -m "Add feature: X"

# Push to GitHub
git push

# Vercel auto-deploys! ✨
```

---

## 🆘 Troubleshooting

### "Permission denied" when pushing?
Generate a GitHub Personal Access Token:
1. [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **Generate new token** → **Generate new token (classic)**
3. Select scopes: `repo`, `workflow`
4. Copy the token
5. When git asks for password, paste the token instead

### Deployment stuck on "Building"?
- Check Vercel logs: Dashboard → Deployments → Click the failed deployment
- Verify all environment variables are set
- Ensure `npm run build` works locally: `npm run build`

### Getting 404 errors after deploy?
- Clear Vercel cache: Dashboard → Project Settings → Advanced → Purge Cache
- Redeploy: Dashboard → Deployments → Click the three dots → Redeploy

---

## 🎉 You're All Set!

Your Netflix Clone is now:
- ✅ Version controlled on GitHub
- ✅ Deployed live on Vercel
- ✅ Auto-updating on every push
- ✅ Shareable with anyone

**Next steps:**
- Share your live link with friends
- Add more features (search, filters, ratings, etc.)
- Star your own repo for bookmarking!

Happy coding! 🚀
