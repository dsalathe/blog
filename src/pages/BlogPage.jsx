import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogById } from '../data/blogs';
import Markdown from 'markdown-to-jsx';
import ShareButton from '../components/ShareButton';

function BlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add this useEffect to handle scroll reset
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImageUrl = (imagePath) => {
    const baseUrl = import.meta.env.BASE_URL;
    return imagePath ? `${baseUrl}${imagePath}` : null;
  };

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const foundBlog = await getBlogById(parseInt(id));
        setBlog(foundBlog);
      } catch (error) {
        console.error('Error loading blog:', error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadBlog();
  }, [id]);

  const baseUrl = import.meta.env.BASE_URL;
  
  const processMarkdown = (content) => {
    return content.replace(/\${baseUrl}/g, baseUrl);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!blog) {
    return (
      <div style={{ padding: '20px' }}>
        <p>Blog post not found</p>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="blog-post-container">
      <article className="blog-post">
        {blog.image && (
          <div className="blog-post-image">
            <img 
              src={getImageUrl(blog.image)} 
              alt={blog.title}
              loading="lazy"
            />
          </div>
        )}
        <Markdown>{processMarkdown(blog.content)}</Markdown>
        <div className="blog-post-meta">
          <p className="blog-post-date">Published: {formatDate(blog.publishedDate)}</p>
          <ShareButton title={blog.title} />
        </div>
      </article>
      <Link to="/" className="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to Home
      </Link>
    </div>
  );
}

export default BlogPage;