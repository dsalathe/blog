import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogById } from '../data/blogs';
import Markdown from 'markdown-to-jsx';
import ShareButton from '../components/ShareButton';
import CopyButton from '../components/CopyButton';
import ImageModal from '../components/ImageModal';

// Custom code block component with copy functionality
function CodeBlock({ children, className }) {
  // Extract the actual code text from the children structure
  const getCodeText = (children) => {
    if (typeof children === 'string') return children;
    if (React.isValidElement(children) && children.props?.children) {
      return getCodeText(children.props.children);
    }
    if (Array.isArray(children)) {
      return children.map(child => getCodeText(child)).join('');
    }
    return String(children || '');
  };

  const codeText = getCodeText(children);
  const language = className ? className.replace('lang-', '') : '';
  
  return (
    <div className="code-block-wrapper">
      <CopyButton text={codeText} />
      <pre className={className}>
        <code>{children}</code>
      </pre>
    </div>
  );
}

// Custom clickable image component for the modal
function ClickableImage({ src, alt, title, openModal, ...props }) {
  const handleImageClick = () => {
    openModal(src, alt || title || '');
  };

  return (
    <img
      src={src}
      alt={alt}
      title={title}
      className="clickable"
      onClick={handleImageClick}
      {...props}
    />
  );
}

function BlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFuturePost, setIsFuturePost] = useState(false);
  const [nextBlogInfo, setNextBlogInfo] = useState(null);
  
  // Image modal state
  const [modalImage, setModalImage] = useState({ isOpen: false, src: '', alt: '' });

  // handle scroll reset
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Modal functions
  const openModal = (imageSrc, imageAlt) => {
    setModalImage({ isOpen: true, src: imageSrc, alt: imageAlt });
  };

  const closeModal = () => {
    setModalImage({ isOpen: false, src: '', alt: '' });
  };

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
  
// Enhanced Obsidian-style callouts with comprehensive type support
const calloutIcons = {
  // Existing types
  note: '<i class="fa-solid fa-pencil"></i>',
  warning: '<i class="fa-solid fa-triangle-exclamation"></i>',
  tip: '<i class="fa-solid fa-fire"></i>',
  info: '<i class="fa-solid fa-info"></i>',
  danger: '<i class="fa-solid fa-zap"></i>',
  question: '<i class="fa-solid fa-circle-question"></i>',
  
  // New types
  abstract: '<i class="fa-solid fa-clipboard-list"></i>',
  todo: '<i class="fa-solid fa-circle-check"></i>',
  success: '<i class="fa-solid fa-check"></i>',
  failure: '<i class="fa-solid fa-x"></i>',
  bug: '<i class="fa-solid fa-bug"></i>',
  example: '<i class="fa-solid fa-list-ol"></i>',
  quote: '<i class="fa-solid fa-quote-left"></i>',
  
  // Aliases - these will map to the same styling as their parent types
  summary: '<i class="fa-solid fa-clipboard-list"></i>', // -> abstract
  tldr: '<i class="fa-solid fa-clipboard-list"></i>',    // -> abstract
  hint: '<i class="fa-solid fa-fire"></i>',             // -> tip
  important: '<i class="fa-solid fa-fire"></i>',        // -> tip
  check: '<i class="fa-solid fa-check"></i>',           // -> success
  done: '<i class="fa-solid fa-check"></i>',            // -> success
  help: '<i class="fa-solid fa-circle-question"></i>',  // -> question
  faq: '<i class="fa-solid fa-circle-question"></i>',   // -> question
  caution: '<i class="fa-solid fa-triangle-exclamation"></i>', // -> warning
  attention: '<i class="fa-solid fa-triangle-exclamation"></i>', // -> warning
  fail: '<i class="fa-solid fa-x"></i>',                // -> failure
  missing: '<i class="fa-solid fa-x"></i>',             // -> failure
  error: '<i class="fa-solid fa-zap"></i>',             // -> danger
  cite: '<i class="fa-solid fa-quote-left"></i>',       // -> quote
};

// Map aliases to their parent types for CSS styling
const calloutTypeMapping = {
  // Direct types
  note: 'note',
  warning: 'warning', 
  tip: 'tip',
  info: 'info',
  danger: 'danger',
  question: 'question',
  abstract: 'abstract',
  todo: 'todo',
  success: 'success',
  failure: 'failure',
  bug: 'bug',
  example: 'example',
  quote: 'quote',
  
  // Aliases mapped to parent types
  summary: 'abstract',
  tldr: 'abstract',
  hint: 'tip',
  important: 'tip',
  check: 'success',
  done: 'success',
  help: 'question',
  faq: 'question',
  caution: 'warning',
  attention: 'warning',
  fail: 'failure',
  missing: 'failure',
  error: 'danger',
  cite: 'quote',
};

const processMarkdown = (content) => {
  let processed = content.replace(/\${baseUrl}/g, baseUrl);
  
  // Enhanced callout processing function
  const processCalloutBody = (body) => {
    // Remove the '> ' prefix from each line
    let cleanBody = body.replace(/^> ?/gm, '');
    
    // Clean up excessive whitespace while preserving intentional spacing
    cleanBody = cleanBody.replace(/\n{3,}/g, '\n\n').trim();
    
    return '\n' + cleanBody;
  };

  // Collapsible callouts EXPANDED by default: > [!type]+ title\ncontent
  processed = processed.replace(
    /^> \[!(\w+)\]\+\s*(.*)?\n((?:>.*(?:\n|$))*)/gm,
    (match, type, title, body) => {
      const lowerType = type.toLowerCase();
      const mappedType = calloutTypeMapping[lowerType] || lowerType;
      const icon = calloutIcons[lowerType] || '<i class="fa-solid fa-message"></i>';
      
      const cleanBody = processCalloutBody(body);
      const titleText = title && title.trim() ? title.trim() : `${type.charAt(0).toUpperCase() + type.slice(1)}`;
      const calloutTitle = `<span class="callout-title"><span class="callout-toggle">▼</span><span class="callout-icon">${icon}</span><p>${titleText}</p></span>`;
      
      return `<div class="callout callout-${mappedType} collapsible">${calloutTitle}<div class="callout-body"><br/>${cleanBody}</div></div>`;
    }
  );
  
  // Collapsible callouts COLLAPSED by default: > [!type]- title\ncontent
  processed = processed.replace(
    /^> \[!(\w+)\]-\s*(.*)?\n((?:>.*(?:\n|$))*)/gm,
    (match, type, title, body) => {
      const lowerType = type.toLowerCase();
      const mappedType = calloutTypeMapping[lowerType] || lowerType;
      const icon = calloutIcons[lowerType] || '<i class="fa-solid fa-message"></i>';
      
      const cleanBody = processCalloutBody(body);
      const titleText = title && title.trim() ? title.trim() : `${type.charAt(0).toUpperCase() + type.slice(1)}`;
      const calloutTitle = `<span class="callout-title"><span class="callout-toggle">▼</span><span class="callout-icon">${icon}</span><p>${titleText}</p></span>`;
      
      return `<div class="callout callout-${mappedType} collapsible collapsed">${calloutTitle}<div class="callout-body"><br/>${cleanBody}</div></div>`;
    }
  );
  
  // Non-collapsible callouts: > [!type] title\ncontent
  processed = processed.replace(
    /^> \[!(\w+)\]\s+(.*)?\n((?:>.*(?:\n|$))*)/gm,
    (match, type, title, body) => {
      const lowerType = type.toLowerCase();
      const mappedType = calloutTypeMapping[lowerType] || lowerType;
      const icon = calloutIcons[lowerType] || '<i class="fa-solid fa-message"></i>';
      
      const cleanBody = processCalloutBody(body);
      const titleText = title && title.trim() ? title.trim() : `${type.charAt(0).toUpperCase() + type.slice(1)}`;
      const calloutTitle = `<span class="callout-title"><span class="callout-icon">${icon}</span><p>${titleText}</p></span>`;
      
      return `<div class="callout callout-${mappedType}">${calloutTitle}<div class="callout-body"><br/>${cleanBody}</div></div>`;
    }
  );
  
  // Handle single-line callouts (same logic as before)
  processed = processed.replace(
    /^> \[!(\w+)\]\+\s*(.*)$/gm,
    (match, type, title) => {
      const lowerType = type.toLowerCase();
      const mappedType = calloutTypeMapping[lowerType] || lowerType;
      const icon = calloutIcons[lowerType] || '<i class="fa-solid fa-message"></i>';
      const titleText = title && title.trim() ? title.trim() : `${type.charAt(0).toUpperCase() + type.slice(1)}`;
      const calloutTitle = `<span class="callout-title"><span class="callout-toggle">▼</span><span class="callout-icon">${icon}</span><p>${titleText}</p></span>`;
      return `<div class="callout callout-${mappedType} collapsible">${calloutTitle}<div class="callout-body"></div></div>`;
    }
  );
  
  processed = processed.replace(
    /^> \[!(\w+)\]-\s*(.*)$/gm,
    (match, type, title) => {
      const lowerType = type.toLowerCase();
      const mappedType = calloutTypeMapping[lowerType] || lowerType;
      const icon = calloutIcons[lowerType] || '<i class="fa-solid fa-message"></i>';
      const titleText = title && title.trim() ? title.trim() : `${type.charAt(0).toUpperCase() + type.slice(1)}`;
      const calloutTitle = `<span class="callout-title"><span class="callout-toggle">▼</span><span class="callout-icon">${icon}</span><p>${titleText}</p></span>`;
      return `<div class="callout callout-${mappedType} collapsible collapsed">${calloutTitle}<div class="callout-body"></div></div>`;
    }
  );
  
  processed = processed.replace(
    /^> \[!(\w+)\]\s+(.*)$/gm,
    (match, type, title) => {
      const lowerType = type.toLowerCase();
      const mappedType = calloutTypeMapping[lowerType] || lowerType;
      const icon = calloutIcons[lowerType] || '<i class="fa-solid fa-message"></i>';
      const titleText = title && title.trim() ? title.trim() : `${type.charAt(0).toUpperCase() + type.slice(1)}`;
      const calloutTitle = `<span class="callout-title"><span class="callout-icon">${icon}</span><p>${titleText}</p></span>`;
      return `<div class="callout callout-${mappedType}">${calloutTitle}<div class="callout-body"></div></div>`;
    }
  );
  
  return processed;
};

// Add effect for folding callouts
useEffect(() => {
  const handleToggle = (e) => {
    const title = e.target.closest('.callout-title');
    if (title) {
      const callout = title.parentElement;
      // Only allow toggling for callouts that are meant to be collapsible
      if (callout.classList.contains('collapsible')) {
        if (callout.classList.contains('collapsed')) {
          callout.classList.remove('collapsed');
        } else {
          callout.classList.add('collapsed');
        }
      }
    }
  };
  document.addEventListener('click', handleToggle);
  return () => document.removeEventListener('click', handleToggle);
}, []);

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
            {blog.audience && (
              <p className="blog-audience">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {Array.isArray(blog.audience) ? blog.audience.join(', ') : blog.audience}
              </p>
            )}
          </div>
        </div>
        
        <Markdown 
          options={{
            overrides: {
              pre: {
                component: CodeBlock,
              },
              img: {
                component: ClickableImage,
                props: {
                  openModal: openModal,
                },
              },
            },
          }}
        >
          {processMarkdown(blog.content)}
        </Markdown>
        
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
      
      {/* Image Modal */}
      <ImageModal
        isOpen={modalImage.isOpen}
        onClose={closeModal}
        imageSrc={modalImage.src}
        imageAlt={modalImage.alt}
      />
    </div>
  );
}

export default BlogPage;