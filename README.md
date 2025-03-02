# Personal Blog - React

![React Blog App](https://github.com/dsalathe/blog/raw/main/public/mountainAlps.webp)

## Overview

This is a responsive personal blog application built with React and Vite, designed for easy content management and GitHub Pages deployment. The blog features a clean, modern interface with search functionality, responsive design, and Markdown content support.

## Features

- 📱 **Responsive Design**: Optimized for mobile, tablet, and desktop viewing
- 🔍 **Search Functionality**: Filter blog posts by keywords
- ✨ **Modern UI**: Clean, professional interface with animations and transitions
- 📝 **Markdown Support**: Write blog posts in Markdown with frontmatter metadata
- 🖼️ **Image Optimization**: Lazy-loading images for improved performance
- 🔄 **GitHub Actions**: Automated deployment to GitHub Pages
- 🔗 **Social Sharing**: Built-in sharing functionality for blog posts
- 🧩 **Component-Based Architecture**: Modular and maintainable code structure

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: CSS with responsive design
- **Content**: Markdown with gray-matter for frontmatter parsing
- **Deployment**: GitHub Pages via GitHub Actions

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/blog.git
   cd blog
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Adding Blog Posts

Create new Markdown files in the `src/data/posts/` directory with the following frontmatter format:

```markdown
---
id: 5
title: Your Blog Post Title
description: A brief description of the post
publishedDate: 2025-03-02
image: your-image.jpg
keywords:
  - keyword1
  - keyword2
---

# Your Blog Post Title

Your content goes here...
```

Images should be placed in the `public` directory.

## Deployment

This project is configured to deploy to GitHub Pages using GitHub Actions. When you push changes to the `main` branch, the workflow will automatically build and deploy the application.

To set up deployment:

1. Ensure your repository is configured to use GitHub Pages
2. Update the `homepage` field in `package.json` with your GitHub Pages URL
3. Push changes to the `main` branch

## Development with GitHub Codespaces

This repository is configured for GitHub Codespaces, providing a complete development environment in the cloud:

1. Click on the "Code" button on the repository page
2. Select "Open with Codespaces"
3. Create a new codespace or use an existing one

The development server will start automatically, and all necessary extensions will be pre-installed.

## Project Structure

```
blog/
├── .devcontainer/    # Codespaces configuration
├── .github/          # GitHub Actions workflows
├── public/           # Static assets and images
├── src/
│   ├── components/   # Reusable UI components
│   ├── data/         # Blog post content (Markdown files)
│   ├── pages/        # Page components
│   ├── utils/        # Utility functions
│   ├── App.jsx       # Main application component
│   └── index.jsx     # Application entry point
└── vite.config.js    # Vite configuration
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request