# Preview Links for Draft Articles

This document contains shareable preview links for draft articles that haven't been published yet.

## Distributed Transactions Series

### Post 22: Data Ownership
- **Token**: `k7m2p9x4a1`
- **Preview URL**: `#/blog/22?preview=k7m2p9x4a1`
- **Full URL**: `https://dsalathe.github.io/blog/#/blog/22?preview=k7m2p9x4a1`
- **Scheduled**: 9999-12-29

### Post 23: ACID and Saga Fundamentals
- **Token**: `n5q8t3r6b9`
- **Preview URL**: `#/blog/23?preview=n5q8t3r6b9`
- **Full URL**: `https://dsalathe.github.io/blog/#/blog/23?preview=n5q8t3r6b9`
- **Scheduled**: 9999-12-30

### Post 24: The Eight Saga Patterns - A Complete Taxonomy
- **Token**: `w1f4j7e2d8`
- **Preview URL**: `#/blog/24?preview=w1f4j7e2d8`
- **Full URL**: `https://dsalathe.github.io/blog/#/blog/24?preview=w1f4j7e2d8`
- **Scheduled**: 9999-12-31

---

## How to Use Preview Links

1. **Share a specific article**: Send the preview URL to reviewers
2. **Token is in the URL**: Visible but hard to guess without the link
3. **Single article access**: Each token only unlocks that specific article
4. **No expiration**: Tokens work until removed from frontmatter
5. **Session-based**: Refreshing loses access unless URL keeps the `?preview=` param

## How to Add Preview Tokens to New Articles

1. Generate a random token (10 chars recommended):
   ```bash
   # Using Node.js
   node -e "console.log(require('crypto').randomBytes(5).toString('hex'))"
   
   # Or manually create something like: a3f5d9e2bc
   ```

2. Add to article frontmatter:
   ```yaml
   ---
   id: 25
   title: "Your Article"
   publishedDate: "2025-12-01"
   previewToken: "a3f5d9e2bc"
   ---
   ```

3. Build the preview URL:
   ```
   #/blog/25?preview=a3f5d9e2bc
   ```

## Removing Preview Access

Simply delete the `previewToken` field from the article's frontmatter when you're ready to publish.
