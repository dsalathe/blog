import matter from 'gray-matter';
import { calculateReadingTime } from './readingTime';

const blogFiles = import.meta.glob('../data/posts/*.md', { as: 'raw' });

export const loadBlogPost = async (id) => {
  try {
    const fileName = Object.keys(blogFiles).find(
      path => path.includes(`${id.toString().padStart(3, '0')}-`)
    );

    if (!fileName) {
      return null;
    }

    const content = await blogFiles[fileName]();
    const { data, content: markdownContent } = matter(content);
    
    return {
      ...data,
      content: markdownContent,
      readingTime: calculateReadingTime(markdownContent)
    };
  } catch (error) {
    console.error(`Error loading blog post ${id}:`, error);
    return null;
  }
};

export const loadBlogPosts = async () => {
  try {
    console.log('Available blog files:', Object.keys(blogFiles)); // Debug line
    const posts = [];
    const files = Object.keys(blogFiles);
    
    for (const path of files) {
      const content = await blogFiles[path]();
      console.log('Processing file:', path); // Debug line
      const { data, content: markdownContent } = matter(content);
      console.log('Parsed frontmatter:', data); // Debug line
      posts.push({
        id: data.id,
        title: data.title,
        description: data.description,
        publishedDate: data.publishedDate,
        keywords: data.keywords,
        image: data.image,
        readingTime: calculateReadingTime(markdownContent)
      });
    }
    
    // Sort by publishedDate instead of id
    const sortedPosts = posts.sort((a, b) => 
      new Date(b.publishedDate) - new Date(a.publishedDate)
    );
    console.log('Final posts array:', sortedPosts); // Debug line
    return sortedPosts;
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
};