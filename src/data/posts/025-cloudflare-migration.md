---
id: 25
title: "Moving to Cloudflare Pages: A New Home for the Blog (and a New Domain)"
description: "Why I migrated from GitHub Pages to Cloudflare Pages, the benefits of the move, and introducing dsalathe.dev—a new domain that will host multiple projects beyond just this blog."
publishedDate: 2025-12-25
image: cloudflare-migration.png

audience:
  - Developers
  - DevOps Engineers
keywords:
  - Cloudflare Pages
  - GitHub Pages
  - Domain Migration
  - Web Performance
  - Static Site Hosting
  - CDN
  - GDPR
---

If you're reading this, you've already made it to the new home: `blog.dsalathe.dev`. Welcome! 🎉

This blog has moved from `dsalathe.github.io/blog` to Cloudflare Pages, and I'm excited to share why—and what's coming next.

## <i class="fa-solid fa-rocket"></i> Why Move?

GitHub Pages has served me well. It's free, reliable, and integrates seamlessly with GitHub repositories. For a static blog, it's hard to beat. So why fix what isn't broken?

**Because it could be better.**

Here's what prompted the move:

### The Performance Edge

Cloudflare operates one of the world's largest CDN networks with over 200 data centers globally. GitHub Pages has CDN capabilities, but they're more limited in scope. When your readers span continents, milliseconds matter.

**PageSpeed Insights on Cloudflare Pages**: 88/100 for performance. Not perfect, but solid. More importantly, content is served from edge locations closer to readers, reducing latency globally.

### Unlimited Bandwidth

GitHub Pages has a soft limit of 100GB bandwidth per month—more than enough for most personal blogs. But "soft limit" means GitHub might contact you if you exceed it consistently. Cloudflare Pages? **Unlimited bandwidth.** No worries, no throttling, no surprises.

### The Analytics Advantage

Here's a surprising win: **Cloudflare Web Analytics is GDPR-compliant without cookie banners**.

Wait, what? No cookie consent popup?

That's right. Cloudflare's analytics:
- Uses no cookies
- Collects no personal data
- Performs no cross-site tracking
- Aggregates data only

This means I can track pageviews, popular posts, and traffic sources **without annoying readers with cookie banners**. No Google Analytics scripts slowing down page loads. No third-party tracking concerns. Just clean, privacy-first analytics.

### Enterprise-Grade Security (For Free)

DDoS protection. Web Application Firewall. Automatic SSL/TLS certificates. Rate limiting. All included in the free tier.

GitHub Pages offers SSL too, but Cloudflare's security infrastructure is on another level—typically reserved for enterprise customers paying thousands monthly. For a personal blog? Free.

### Better Build Performance

Cloudflare Pages builds are fast. Really fast. Deployments that took 3-5 minutes on GitHub Pages now complete in 1-2 minutes. Every PR gets an automatic preview deployment with a unique URL—perfect for reviewing changes before merging.

The free tier includes 500 builds per month. I'll never hit that limit, but it's nice knowing the ceiling is high.

## <i class="fa-solid fa-code-compare"></i> The Technical Comparison

Let me break down the actual differences:

| Feature | GitHub Pages | Cloudflare Pages |
|---------|--------------|------------------|
| **Cost** | Free ✅ | Free ✅ |
| **SSL Certificate** | Let's Encrypt | Cloudflare Universal SSL |
| **CDN** | GitHub CDN | 200+ global locations |
| **Bandwidth** | 100GB/mo (soft) | Unlimited |
| **Build Time** | 2-5 min | 1-3 min |
| **Builds/Month** | Unlimited | 500 (more than enough) |
| **Analytics** | Google Analytics (requires cookie banner) | Built-in, GDPR-compliant |
| **DDoS Protection** | Basic | Enterprise-grade |
| **Preview Deploys** | Manual setup | Automatic per PR |
| **Custom Headers** | Not supported | Via `_headers` file |
| **Redirects** | Via meta tags or JavaScript | Via `_redirects` file |

Both platforms are excellent. Both are free. But for a static site with global reach, Cloudflare Pages edges ahead.

## <i class="fa-solid fa-layer-group"></i> Introducing dsalathe.dev

The migration wasn't just about hosting. I acquired a new domain: **dsalathe.dev**.

This domain will become the central hub for multiple projects I'm building. Here's what's planned:

### <i class="fa-solid fa-blog"></i> blog.dsalathe.dev (You Are Here)

The blog you're reading right now. Technical articles on software architecture, distributed systems, AI, and whatever else catches my interest. Powered by React, Vite, and Cloudflare Pages.

### <i class="fa-solid fa-home"></i> dsalathe.dev (Coming Soon)

A landing page explaining who I am and showcasing all the projects under this domain. Think of it as a central hub—one place to discover everything I'm building.

### <i class="fa-solid fa-key"></i> auth.dsalathe.dev (Coming Soon)

A centralized Identity Provider (IdP) based on **Keycloak**.

Why build this? Because I'm tired of managing separate authentication for every project. With `auth.dsalathe.dev`, I'll have true Single Sign-On (SSO) across all my applications. Log in once, access everything.

Keycloak is battle-tested, supports OAuth 2.0, OpenID Connect, SAML, and offers fine-grained authorization. It's the same technology powering enterprise identity systems—available for personal projects.


### <i class="fa-solid fa-chess-rook"></i> citybreakers.dsalathe.dev (in progress)

A browser-based tower defense game built with **Vue 3** and **Spring Boot**.

This project showcases:
- **Domain-Driven Design (DDD)** with hexagonal architecture
- **Cryptographic mechanisms** to decentralize game engines within the browser (no cheating by inspecting network requests!)
- **ActiveMQ** for real-time, 8-player multiplayer lobbies
- Progressive Web App (PWA) support—install it and play offline

Tower defense meets distributed systems. Because why not?

### <i class="fa-solid fa-file-lines"></i> tailor.dsalathe.dev (coming soon)

A web tool to manage and tailor your Curriculum Vitae.

The problem: you have one verbose CV with everything you've ever done. But each job application needs a tailored version highlighting relevant experience.

**Tailor** solves this by:
- Storing your master CV with all experience, skills, and projects
- Letting you paste a job description
- Using LLMs to suggest which sections to emphasize
- Generating a tailored CV matching the job requirements

No more manually editing CVs for every application. Let the tool do the heavy lifting.

### <i class="fa-solid fa-train"></i> tchutchu.dsalathe.dev

A 2-player web game built with **Vue 3**, **Scala 3** and **Spring Boot**, using **WebSockets** for real-time gameplay.

This one's hosted on **Google Cloud Platform (GCP)** using **Cloud Run**, demonstrating serverless deployment for real-time applications. It's a fun experiment in building low-latency multiplayer experiences without managing infrastructure.

### <i class="fa-solid fa-ellipsis"></i> More Coming Soon

These are just the projects I've already started. As I build more tools, experiments, and side projects, they'll all live under `dsalathe.dev`.

One domain. Multiple subdomains. Centralized authentication. A cohesive ecosystem of projects.

## <i class="fa-solid fa-wrench"></i> The Migration Process

For anyone considering a similar move, here's what the process looked like:

### Code Changes

Migrating required updating:
- **Vite config**: Changed `base` from `/blog/` to `/` (no subdirectory needed with a dedicated subdomain)
- **package.json**: Updated homepage URL
- **Internal links**: Updated all blog post cross-references
- **ShareButton component**: Updated default URL for social sharing
- **Analytics**: Removed Google Analytics, added Cloudflare Web Analytics script

All told? About 10 files changed. Not bad for a complete platform migration.

### Cloudflare Setup

1. **Connect GitHub repository** to Cloudflare Pages
2. **Configure build settings**: `npm run build` → output to `dist/`
3. **Add custom domain**: `blog.dsalathe.dev` via CNAME record
4. **SSL provisioning**: Automatic, took about 2 minutes
5. **DNS propagation**: Instant (thanks to Cloudflare managing both DNS and hosting)

Total setup time? **About 30 minutes.** Most of that was waiting for the initial build.

### GitHub Pages Redirect

I didn't want to break old links. Anyone visiting `dsalathe.github.io/blog` should automatically redirect to `blog.dsalathe.dev`.

Solution: Create a lightweight redirect branch with a single `index.html`:

```html
<!DOCTYPE html>
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
</head>
<body>
    <div class="container">
        <h1>🚀 We've moved!</h1>
        <p>This blog is now available at 
           <a href="https://blog.dsalathe.dev">blog.dsalathe.dev</a>
        </p>
        <p>Redirecting automatically...</p>
    </div>
</body>
</html>
```

This preserves:
- Full path: `/blog/#/blog/22` → `/#/blog/22`
- Query parameters: `?preview=xyz`
- Hash fragments: `#/blog/1`

Old bookmarks, social media links, and search engine results all continue working.

## <i class="fa-solid fa-chart-line"></i> What I'm Watching

After the migration, here's what I'm monitoring:

**Performance:**
- Lighthouse scores (currently 88/100 for performance)
- Time to First Byte (TTFB) from different geographic locations
- Core Web Vitals

**Analytics:**
- Pageviews and unique visitors (via Cloudflare Analytics)
- Popular posts and referral sources
- Geographic distribution of readers

**Costs:**
- Still $0. All free tier so far.
- Domain registration: ~$12/year (the only actual cost)

## <i class="fa-solid fa-forward"></i> What's Next

Now that the blog is settled, I'm focusing on:

1. **Building out dsalathe.dev** - The landing page hub
2. **Setting up auth.dsalathe.dev** - Keycloak-based SSO for all projects
3. **Polishing citybreakers.dsalathe.dev** - 8-player tower defense needs more towers!
4. **Shipping tailor.dsalathe.dev** - Beta launch for friends testing CV tailoring

Each project will get its own article once it's live. Stay tuned.

## <i class="fa-solid fa-comments"></i> Final Thoughts

GitHub Pages is fantastic. For many use cases, it's the perfect choice. But if you're looking for:
- Global CDN performance
- Unlimited bandwidth
- Privacy-first analytics
- Enterprise security on a free tier
- Blazing-fast builds

**Cloudflare Pages deserves serious consideration.**

The migration took less than an hour of actual work. The benefits are immediate and ongoing. And with the new `dsalathe.dev` domain, I now have room to grow—one subdomain at a time.

Welcome to the new blog. Same content, better platform, exciting future.

---

**Like this post?** Share it using the button below. Got questions about the migration? Find me on GitHub or on [linkedin](https://www.linkedin.com/in/david-salathe/).

**Old URL still works:** `dsalathe.github.io/blog` redirects here automatically. Bookmarks preserved. ✅
