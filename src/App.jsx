import './App.css';
import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';

// ScrollToTop component that will be used inside the Router
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
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
  );
}

export default App;