import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogById } from '../data/blogs';
import Markdown from 'markdown-to-jsx';
import ShareButton from '../components/ShareButton';

function BlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFuturePost, setIsFuturePost] = useState(false);
  const [nextBlogInfo, setNextBlogInfo] = useState(null);

  // handle scroll reset
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
        
        if (foundBlog) {
          // Check if post date is in the future
          const postDate = new Date(foundBlog.publishedDate);
          const now = new Date();
          
          if (postDate > now && process.env.NODE_ENV !== 'development') {
            setIsFuturePost(true);
            setBlog(null);
          } else {
            setBlog(foundBlog);
            
            // If there's a next blog post ID, fetch its publication date
            if (foundBlog.next) {
              try {
                const nextBlog = await getBlogById(parseInt(foundBlog.next));
                setNextBlogInfo(nextBlog);
              } catch (nextError) {
                console.error('Error loading next blog:', nextError);
                setNextBlogInfo(null);
              }
            }
          }
        } else {
          setBlog(null);
        }
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

  if (isFuturePost) {
    return (
      <div style={{ padding: '20px' }}>
        <p>This post is scheduled for future publication and is not yet available.</p>
        <Link to="/">Back to Home</Link>
      </div>
    );
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
        
        {/* Reading time indicator at the top */}
        <div className="blog-post-header">
          <h1>{blog.title}</h1>
          <div className="blog-post-meta-top">
            <p className="blog-post-date">Published: {formatDate(blog.publishedDate)}</p>
            <p className="reading-time">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {blog.readingTime}
            </p>
          </div>
        </div>
        
        <Markdown>{processMarkdown(blog.content)}</Markdown>
        
        <div className="blog-post-meta">
          <ShareButton title={blog.title} />
        </div>

        {/* Blog post navigation */}
        {(blog.previous || (blog.next && nextBlogInfo)) && (
          <div className="blog-post-navigation">
            {blog.previous ? (
              <Link to={`/blog/${blog.previous}`} className="blog-nav-button blog-nav-prev">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Previous Part
              </Link>
            ) : (
              <div className="blog-nav-placeholder"></div>
            )}
            
            {blog.next && nextBlogInfo && new Date(nextBlogInfo.publishedDate) <= new Date() ? (
              // Only show next if it exists, is loaded, and is not a future post
              <Link to={`/blog/${blog.next}`} className="blog-nav-button blog-nav-next">
                Next Part
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            ) : (
              <div className="blog-nav-placeholder"></div>
            )}
          </div>
        )}
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