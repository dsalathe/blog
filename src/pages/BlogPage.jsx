import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';
import { getBlogById } from '../data/blogs';
import ShareButton from '../components/ShareButton';
import CopyButton from '../components/CopyButton';
import { useEasterEgg } from '../contexts/EasterEggContext';
import ImageModal from '../components/ImageModal';
import { isValidElement } from 'react';

// Custom code block component with copy functionality
function CodeBlock({ children, className }) {
  // Extract the actual code text from the children structure
  const getCodeText = (children) => {
    if (typeof children === 'string') return children;
    if (isValidElement(children) && children.props?.children) {
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

// Custom clickable image component for modal functionality
function ClickableImage({ src, alt, title, openModal, ...props }) {
  const [isHovering, setIsHovering] = useState(false);
  
  const handleImageClick = (e) => {
    e.preventDefault();
    openModal(src, alt || title || 'Image');
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const baseStyle = {
    cursor: 'zoom-in',
    transition: 'all 0.3s ease',
    position: 'relative',
    border: '2px solid',
    borderColor: 'transparent',
    borderRadius: '8px',
    maxWidth: '100%',
    height: 'auto',
    margin: '2rem auto',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'block',
  };

  const hoverStyle = {
    ...baseStyle,
    borderColor: '#4299e1',
    boxShadow: '0 12px 35px rgba(66, 153, 225, 0.25)',
    filter: 'brightness(1.05)',
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img
        src={src}
        alt={alt}
        title={title}
        className="clickable"
        onClick={handleImageClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={isHovering ? hoverStyle : baseStyle}
        {...props}
      />
      {/* Magnifying glass icon */}
      {isHovering && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '32px',
            height: '32px',
            background: 'rgba(66, 153, 225, 0.9)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            color: 'white',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            animation: 'fadeIn 0.3s ease forwards',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          🔍
        </div>
      )}
      {/* Shimmer overlay */}
      {isHovering && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 40%, rgba(66, 153, 225, 0.1) 50%, transparent 60%)',
            borderRadius: '8px',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}
    </div>
  );
}

function BlogPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const previewToken = searchParams.get('preview');
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFuturePost, setIsFuturePost] = useState(false);
  const [nextBlogInfo, setNextBlogInfo] = useState(null);
  const [loadedBlog, setLoadedBlog] = useState(null); // Store the loaded blog separately
  const { canAccessPost, unlockPreview, previewedPostIds, isUnlocked } = useEasterEgg();
  
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
        setLoading(true);
        
        // Always load the blog post (ignoring publish date initially)
        const foundBlog = await getBlogById(parseInt(id), true);
        
        if (!foundBlog) {
          setLoadedBlog(null);
          setBlog(null);
          setLoading(false);
          return;
        }

        // Store the loaded blog
        setLoadedBlog(foundBlog);
        
        // Check if preview token matches and unlock this specific post
        if (previewToken && foundBlog.previewToken === previewToken) {
          unlockPreview(foundBlog.id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading blog:', error);
        setLoadedBlog(null);
        setBlog(null);
        setLoading(false);
      }
    };
    
    loadBlog();
    // Only re-run when id or previewToken changes
  }, [id, previewToken, unlockPreview]);

  // Separate effect to check access and update visibility
  useEffect(() => {
    if (!loadedBlog) {
      setBlog(null);
      setIsFuturePost(false);
      setNextBlogInfo(null);
      return;
    }

    // Check if user has access to this post
    if (canAccessPost(loadedBlog.id, loadedBlog.publishedDate)) {
      setBlog(loadedBlog);
      setIsFuturePost(false);
      
      // If there's a next blog post ID, fetch its publication date
      if (loadedBlog.next) {
        getBlogById(parseInt(loadedBlog.next), true)
          .then(nextBlog => {
            // Only show next if user has access to it
            if (nextBlog && canAccessPost(nextBlog.id, nextBlog.publishedDate)) {
              setNextBlogInfo(nextBlog);
            } else {
              setNextBlogInfo(null);
            }
          })
          .catch(error => {
            console.error('Error loading next blog:', error);
            setNextBlogInfo(null);
          });
      } else {
        setNextBlogInfo(null);
      }
    } else {
      // User doesn't have access - show future post message
      setBlog(null);
      setIsFuturePost(true);
      setNextBlogInfo(null);
    }
  }, [loadedBlog, previewedPostIds, isUnlocked, canAccessPost]);

  // Update document title when blog is loaded
  useEffect(() => {
    if (blog?.title) {
      document.title = `${blog.title} - The Blog`;
    } else if (isFuturePost) {
      document.title = 'Hidden Peak - The Blog';
    } else {
      document.title = 'The Blog';
    }
    
    return () => {
      document.title = 'The Blog'; // Reset on unmount
    };
  }, [blog, isFuturePost]);

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
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (isFuturePost) {
    return (
      <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>🔒 Post Not Available Yet</h2>
        <p style={{ marginTop: '16px', color: '#718096' }}>
          This post is scheduled for future publication and is not yet available.
        </p>
        <Link to="/" className="back-button" style={{ marginTop: '24px', display: 'inline-flex' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </Link>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container" style={{ padding: '40px 20px', textAlign: 'center', minHeight: '400px' }}>
        <h2>📝 Blog Post Not Found</h2>
        <p style={{ marginTop: '16px', color: '#060708ff' }}>
          The blog post you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/" className="back-button" style={{ marginTop: '24px', display: 'inline-flex' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </Link>
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
            
            {blog.next && nextBlogInfo ? (
              // Only show next if it exists, is loaded, and user has access
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