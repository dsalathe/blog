import './App.css';
import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { EasterEggProvider } from './contexts/EasterEggContext';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';

// ScrollToTop component that will be used inside the Router
function ScrollToTop() {
  const { pathname } = useLocation();
 
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Track pageview in Google Analytics
    // Use setTimeout to ensure document.title has been updated by the page component
    setTimeout(() => {
      if (window.gtag) {
        const page_path = `${pathname}${window.location.search}`;
        window.gtag('event', 'page_view', {
          page_path: page_path,
          page_title: document.title,
          page_location: window.location.href,
        });
        // Debug logging - remove after confirming it works
        console.log('GA Page View:', {
          page_path,
          page_title: document.title,
          page_location: window.location.href
        });
      } else {
        console.warn('Google Analytics not loaded');
      }
    }, 100); // Increased timeout slightly to ensure title update
  }, [pathname]);
 
  return null;
}

function App() {
  const baseUrl = import.meta.env.BASE_URL || '';
 
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--mountain-bg-url',
      `url(${baseUrl}mountainAlps.webp)`
    );
  }, [baseUrl]);

  return (
    <EasterEggProvider>
      <Router>
        {/* Add ScrollToTop component to handle scrolling to top on route changes */}
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog/:id" element={<BlogPage />} />
          </Routes>
        </Layout>
      </Router>
    </EasterEggProvider>
  );
}

export default App;