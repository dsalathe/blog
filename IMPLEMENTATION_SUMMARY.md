# Preview Links Implementation Summary

## ✅ What Was Implemented

A simple, maintainable preview link system that allows sharing draft articles for review without requiring hard security measures.

### Changes Made

1. **EasterEggContext Enhancement** (`src/contexts/EasterEggContext.jsx`)
   - Added `previewedPostIds` state to track which posts have been unlocked via preview tokens
   - Added `unlockPreview(postId)` function to unlock specific posts
   - Added `canAccessPost(postId, publishedDate)` helper that checks:
     - Published status (date <= now)
     - Dev mode
     - Easter egg unlocked (all drafts)
     - Specific preview unlock (single draft)

2. **BlogLoader Update** (`src/utils/blogLoader.js`)
   - Modified `loadBlogPost()` to include `previewToken` from frontmatter
   - Token is loaded but only used for validation, not exposed to UI

3. **BlogPage Component** (`src/pages/BlogPage.jsx`)
   - Added `useSearchParams` to extract `?preview=TOKEN` from URL
   - Modified `useEffect` to:
     - Always load blog (ignoring publish date initially)
     - Validate preview token against post's `previewToken` field
     - Call `unlockPreview()` if token matches
     - Use `canAccessPost()` to determine visibility
   - Updated "Next Part" navigation to respect access permissions

4. **HomePage Component** (`src/pages/HomePage.jsx`)
   - Modified to load all blogs (including future ones)
   - Filter visible blogs using `canAccessPost()`
   - Dynamically updates when preview tokens unlock posts

5. **Post Frontmatter** (distributed-transactions series)
   - Added `previewToken` field to posts 22, 23, and 24
   - Tokens: `k7m2p9x4a1`, `n5q8t3r6b9`, `w1f4j7e2d8`

## 🎯 How It Works

### For Authors (You)
1. Generate a random token (e.g., `k7m2p9x4a1`)
2. Add `previewToken: "k7m2p9x4a1"` to post frontmatter
3. Share the URL: `https://yourblog.com/#/blog/22?preview=k7m2p9x4a1`

### For Reviewers
1. Click the preview link
2. Token is validated
3. Only that specific article becomes visible
4. Can navigate Previous/Next if those are also unlocked
5. Home page won't show the draft unless they keep the URL with token

### For Normal Users
- See only published articles (publishedDate <= today)
- No indication draft posts exist
- Easter egg still works to reveal all drafts

## 🔗 Preview Links for Current Drafts

| Post | Title | Token | Preview URL |
|------|-------|-------|-------------|
| 22 | Data Ownership | `k7m2p9x4a1` | `#/blog/22?preview=k7m2p9x4a1` |
| 23 | ACID and Saga Fundamentals | `n5q8t3r6b9` | `#/blog/23?preview=n5q8t3r6b9` |
| 24 | Eight Saga Patterns | `w1f4j7e2d8` | `#/blog/24?preview=w1f4j7e2d8` |

## 🛠️ Maintenance

### Adding Preview Token to New Draft
```yaml
---
id: 25
title: "Your Draft Article"
publishedDate: "2025-12-01"  # Future date
previewToken: "x8y3z7m2q1"   # 10-char random string
---
```

### Generate Random Token
```bash
# Method 1: Using Node.js crypto
node -e "console.log(require('crypto').randomBytes(5).toString('hex'))"

# Method 2: Manual (mix letters and numbers)
# Example: k7m2p9x4a1
```

### Publishing an Article
1. Change `publishedDate` to today or past
2. **Optional**: Remove `previewToken` field (not required, just cleaner)
3. Commit and deploy

## 🔒 Security Considerations

- **No expiration**: Tokens work until removed (by design)
- **URL visibility**: Tokens appear in URLs, browser history, logs
- **Session-based**: Refresh without `?preview=` param loses access
- **Acceptable risk**: Posts will be public eventually
- **Simple tokens**: 36^10 = ~3.6 quadrillion combinations (sufficient)

## ✨ Features Preserved

- ✅ Easter egg (5 clicks) still unlocks all drafts
- ✅ Dev mode still shows all drafts
- ✅ Published posts always visible
- ✅ No database or backend required
- ✅ Static hosting compatible

## 🧪 Testing Checklist

- [x] Build succeeds without errors
- [ ] Preview link unlocks specific draft article
- [ ] Invalid token shows "Post Not Available Yet"
- [ ] Home page hides draft until preview token used
- [ ] Easter egg still reveals all drafts
- [ ] Navigation (Previous/Next) respects access
- [ ] Published posts always accessible

## 📝 Future Enhancements (Optional)

If you ever need more features:
- Token expiration dates
- Server-side token validation
- Analytics on preview link usage
- Email-specific tokens for tracking
- Bulk token generation script
