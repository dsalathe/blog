# Migration Guide: GitHub Pages → Cloudflare Pages

## 🎉 Overview

Moving from `dsalathe.github.io/blog` to `blog.dsalathe.dev` with automatic redirects.

**Cost: FREE** ✅ Cloudflare Pages free tier includes:
- Unlimited sites
- Unlimited requests
- Unlimited bandwidth
- 500 builds/month
- Custom domains
- Free SSL/TLS certificates

---

## 📋 Step-by-Step Guide

### Part 1: Set Up Cloudflare Pages (20 minutes)

#### 1. Access Cloudflare Pages

1. Log in to your [Cloudflare dashboard](https://dash.cloudflare.com/)
2. Select your account
3. Click on **"Workers & Pages"** in the left sidebar
4. Click **"Create application"**
5. Select **"Pages"** tab
6. Click **"Connect to Git"**

#### 2. Connect Your GitHub Repository

1. Click **"Connect GitHub"**
2. Authorize Cloudflare to access your GitHub account
3. Select the **`dsalathe/blog`** repository
4. Click **"Begin setup"**

#### 3. Configure Build Settings

Set the following build configuration:

```
Production branch: main
Build command: npm run build
Build output directory: dist
Root directory: (leave empty)
```

**Environment variables:** (Optional, add if needed)
- None required for this setup

Click **"Save and Deploy"**

#### 4. Wait for First Deployment

- Cloudflare will clone your repo and build your site
- First build takes ~2-5 minutes
- You'll see a temporary URL like `blog-abc.pages.dev`
- **Test it!** Make sure everything works

#### 5. Add Custom Domain

1. In your Cloudflare Pages project, go to **"Custom domains"** tab
2. Click **"Set up a custom domain"**
3. Enter: `blog.dsalathe.dev`
4. Click **"Continue"**
5. Cloudflare will ask you to add DNS records (see Part 2)

---

### Part 2: Configure DNS in Cloudflare (5 minutes)

#### 1. Navigate to DNS Settings

1. In Cloudflare dashboard, select your **`dsalathe.dev`** domain
2. Click on **"DNS"** in the left sidebar

#### 2. Add DNS Record for Blog Subdomain

Cloudflare Pages should automatically add this, but if not:

1. Click **"Add record"**
2. Configure:
   - **Type**: `CNAME`
   - **Name**: `blog`
   - **Target**: `blog-abc.pages.dev` (your Pages URL from step 1.4)
   - **Proxy status**: ✅ Proxied (orange cloud)
   - **TTL**: Auto
3. Click **"Save"**

**Propagation:** Usually instant with Cloudflare, but can take up to 5 minutes.

#### 3. Verify Domain

- Go back to your Pages project → Custom domains
- You should see `blog.dsalathe.dev` with status **"Active"**
- SSL certificate will be provisioned automatically (1-2 minutes)

#### 4. Test Your New Domain

Open `https://blog.dsalathe.dev` in your browser and verify:
- ✅ Site loads correctly
- ✅ HTTPS works (🔒 in address bar)
- ✅ Navigation works
- ✅ Images load
- ✅ All pages work

---

### Part 3: Set Up Redirects on GitHub Pages (10 minutes)

Now we need to redirect all `dsalathe.github.io/blog/*` traffic to `blog.dsalathe.dev`

#### Option A: Replace index.html with Redirect (Recommended)

1. **Commit and push the redirect file:**

```bash
cd /workspaces/blog
git add .
git commit -m "Migrate to blog.dsalathe.dev with redirects"
git push origin main
```

2. **Create a new branch for GitHub Pages redirect:**

```bash
git checkout -b gh-pages-redirect
```

3. **Replace dist with redirect:**

```bash
# Build the site first (for backup)
npm run build

# Create a simple redirect-only version
echo '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0;url=https://blog.dsalathe.dev">
    <script>
        const newDomain = "https://blog.dsalathe.dev";
        const currentPath = window.location.pathname.replace("/blog", "");
        const hash = window.location.hash;
        const search = window.location.search;
        window.location.replace(newDomain + currentPath + search + hash);
    </script>
    <title>Redirecting to blog.dsalathe.dev</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container { text-align: center; padding: 2rem; }
        h1 { font-size: 2rem; margin-bottom: 1rem; }
        p { font-size: 1.1rem; opacity: 0.9; }
        a { color: white; text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 We'"'"'ve moved!</h1>
        <p>This blog is now available at <a href="https://blog.dsalathe.dev">blog.dsalathe.dev</a></p>
        <p>Redirecting automatically...</p>
    </div>
</body>
</html>' > redirect.html
```

4. **Update GitHub Pages Settings:**

   - Go to your repository: `https://github.com/dsalathe/blog`
   - Click **"Settings"**
   - Click **"Pages"** in the left sidebar
   - Under **"Build and deployment"**:
     - Source: Deploy from a branch
     - Branch: Select `gh-pages-redirect` and `/` (root)
   - Click **"Save"**

5. **Push the redirect:**

```bash
git add redirect.html
git commit -m "Add redirect to new domain"
git push origin gh-pages-redirect
```

#### Option B: Keep Current Deployment + Add Redirect Meta Tag

If you want to keep the site temporarily accessible on both domains:

1. Update `public/index.html` to include a meta refresh tag in the `<head>`:

```html
<meta http-equiv="refresh" content="0;url=https://blog.dsalathe.dev">
```

2. This will redirect after 0 seconds, but you can increase it to give users time to see a message.

---

### Part 4: Update GitHub Repository Settings (5 minutes)

#### 1. Update Repository Description

1. Go to your repository: `https://github.com/dsalathe/blog`
2. Click the ⚙️ gear icon (top right, near "About")
3. Update:
   - **Website**: `https://blog.dsalathe.dev`
   - **Description**: Your blog description
4. Click **"Save changes"**

#### 2. Update README.md (Already Done ✅)

The code changes have already updated:
- ✅ `vite.config.js` - Changed base from `/blog/` to `/`
- ✅ `package.json` - Updated homepage URL
- ✅ All internal links in blog posts
- ✅ ShareButton component
- ✅ Preview links

#### 3. Update Social Media / External Links

Update your blog URL on:
- LinkedIn profile
- Twitter/X bio
- Dev.to or Medium profile
- Personal website
- Any other places you've shared your blog

---

### Part 5: Monitor and Test (10 minutes)

#### 1. Test Redirects

Visit these old URLs and verify they redirect:

```
https://dsalathe.github.io/blog/
https://dsalathe.github.io/blog/#/
https://dsalathe.github.io/blog/#/blog/1
https://dsalathe.github.io/blog/#/blog/22?preview=k7m2p9x4a1
```

All should redirect to:

```
https://blog.dsalathe.dev/
https://blog.dsalathe.dev/#/
https://blog.dsalathe.dev/#/blog/1
https://blog.dsalathe.dev/#/blog/22?preview=k7m2p9x4a1
```

#### 2. Test SSL Certificate

1. Visit `https://blog.dsalathe.dev`
2. Click the 🔒 padlock in your browser
3. Verify certificate is valid and issued by Cloudflare

#### 3. Test Performance

- Run [PageSpeed Insights](https://pagespeed.web.dev/)
- Run [GTmetrix](https://gtmetrix.com/)
- Cloudflare's CDN should make it faster!

#### 4. Monitor Cloudflare Analytics

1. Go to your Cloudflare Pages project
2. Click on **"Analytics"** tab
3. Monitor traffic and performance

---

## 🔧 Troubleshooting

### DNS Not Resolving

**Problem:** `blog.dsalathe.dev` doesn't load

**Solution:**
1. Check DNS record is correct: `CNAME blog → your-project.pages.dev`
2. Ensure proxy is enabled (orange cloud ☁️)
3. Wait up to 5 minutes for propagation
4. Clear your DNS cache: `sudo dnsflush` (macOS) or `ipconfig /flushdns` (Windows)
5. Test with: `nslookup blog.dsalathe.dev`

### SSL Certificate Issues

**Problem:** "Not Secure" warning or certificate errors

**Solution:**
1. Cloudflare automatically provisions SSL certificates
2. Wait 5-10 minutes after adding custom domain
3. Check Cloudflare SSL/TLS settings:
   - Go to SSL/TLS → Overview
   - Ensure mode is **"Full"** or **"Full (strict)"**

### Build Failures on Cloudflare

**Problem:** Deployment fails

**Solution:**
1. Check build logs in Cloudflare Pages → Deployments
2. Common issues:
   - Wrong build command (should be `npm run build`)
   - Wrong output directory (should be `dist`)
   - Missing dependencies (check `package.json`)
3. Test locally: `npm run build` should work without errors

### Redirects Not Working

**Problem:** Old GitHub Pages URL doesn't redirect

**Solution:**
1. Verify `gh-pages-redirect` branch exists
2. Check GitHub Pages settings point to correct branch
3. Wait 2-3 minutes for GitHub Pages to deploy
4. Clear browser cache (Ctrl+F5 or Cmd+Shift+R)

---

## 📊 Comparison: GitHub Pages vs Cloudflare Pages

| Feature | GitHub Pages | Cloudflare Pages |
|---------|--------------|------------------|
| **Cost** | Free | Free |
| **SSL** | Free (Let's Encrypt) | Free (Cloudflare) |
| **CDN** | Limited | Global (200+ locations) |
| **Build Speed** | Medium | Fast |
| **Deploy Time** | 2-5 min | 1-3 min |
| **Bandwidth** | Soft limit (100GB/mo) | Unlimited |
| **Custom Domain** | Yes | Yes |
| **Analytics** | Via Google Analytics | Built-in + Web Analytics |
| **DDoS Protection** | Basic | Enterprise-grade |
| **Build Minutes** | Unlimited | 500/month (enough!) |

---

## 🎯 Next Steps (Optional Improvements)

### 1. Set Up Cloudflare Web Analytics (Free!)

1. In Cloudflare dashboard → "Web Analytics"
2. Add your site `blog.dsalathe.dev`
3. Copy the script tag
4. Add to `public/index.html` before `</head>`

**Benefits:**
- Privacy-friendly (no cookies, GDPR compliant)
- Page views, visitors, popular pages
- No impact on performance

### 2. Enable Cloudflare Cache Rules

1. Go to "Caching" → "Cache Rules"
2. Create rule for static assets:
   - `blog.dsalathe.dev/*.(js|css|png|jpg|webp|woff2)`
   - Cache everything
   - Edge TTL: 1 month

### 3. Set Up Preview Deployments

Already configured! Every PR you create will get a preview URL like:
```
https://abc123.blog-abc.pages.dev
```

Perfect for reviewing changes before merging!

### 4. Add Security Headers

Create a `public/_headers` file:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

Cloudflare Pages will automatically apply these headers.

---

## ✅ Checklist

- [ ] Cloudflare Pages project created and deployed
- [ ] `blog.dsalathe.dev` DNS record added
- [ ] SSL certificate active and working
- [ ] New domain tested and working
- [ ] Code changes committed and pushed
- [ ] GitHub Pages redirect deployed
- [ ] Old URLs tested and redirecting correctly
- [ ] Repository settings updated
- [ ] External links updated (social media, etc.)
- [ ] Analytics configured (optional)

---

## 🎉 Success!

Your blog is now live at `https://blog.dsalathe.dev` with:
- ✅ Free hosting
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Automatic redirects from old URLs
- ✅ Better performance
- ✅ Enterprise-grade security

**Old URL redirects:** `dsalathe.github.io/blog/*` → `blog.dsalathe.dev/*`

**Questions?** Check the Cloudflare Pages [documentation](https://developers.cloudflare.com/pages/) or Cloudflare Community forum.
