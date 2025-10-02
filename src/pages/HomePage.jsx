import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getBlogs } from '../data/blogs';
import { useEasterEgg } from '../contexts/EasterEggContext';
import Toast from '../components/Toast';

function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const location = useLocation();
  const { isUnlocked, unlock } = useEasterEgg();

  // handle scroll reset when navigating to the home page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Set document title for home page
  useEffect(() => {
    document.title = 'The Blog - Welcome';
  }, []);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const loadedBlogs = await getBlogs(isUnlocked);
        setBlogs(loadedBlogs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, [isUnlocked]);

  const handleTitleClick = () => {
    if (isUnlocked) return; // Already unlocked
    
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount === 5) {
      unlock();
      setShowToast(true);
    }
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

  const filteredBlogs = blogs.filter(blog =>
    !searchQuery || blog.keywords.some(keyword =>
      keyword.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Toast 
        message="Looks like you found the hidden peaks! 🏔️ Future posts are now visible."
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      
      <div className="hero-section">
        <h1 
          onClick={handleTitleClick} 
          className={`hero-title ${!isUnlocked ? 'clickable' : ''}`}
        >
          Welcome to The Blog
        </h1>
        <p className="subtitle">Exploring ideas, sharing knowledge</p>
      </div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="blog-grid">
        {filteredBlogs.map(blog => {
          const isFuturePost = new Date(blog.publishedDate) > new Date();
          return (
            <Link
              key={blog.id}
              to={`/blog/${blog.id}`}
              className="blog-card-link"
            >
              <article className={`blog-card ${isFuturePost ? 'future-post' : ''}`}>
                {isFuturePost && (
                  <div className="future-badge">
                    🏔️ Hidden Peak
                  </div>
                )}
                {blog.image && (
                  <div className="blog-card-image">
                    <img 
                      src={getImageUrl(blog.image)} 
                      alt={blog.title}
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="blog-card-content">
                <h2>{blog.title}</h2>
                <p className="blog-description">{blog.description}</p>
                <div className="blog-meta">
                  <p className="blog-date">
                    {formatDate(blog.publishedDate)}
                  </p>
                  <p className="reading-time">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {blog.readingTime}
                  </p>
                </div>
                {blog.audience && (
                  <div className="blog-audience-section">
                    <p className="blog-audience">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      {Array.isArray(blog.audience) ? blog.audience.join(', ') : blog.audience}
                    </p>
                  </div>
                )}
                <div className="keywords-container">
                  {blog.keywords.map(keyword => (
                    <span key={keyword} className="keyword-tag">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </Link>
        );
        })}
      </div>

      {filteredBlogs.length === 0 && (
        <div className="no-results">
          <p>No blog posts found matching your search.</p>
        </div>
      )}
    </div>
  );
}

export default HomePage;