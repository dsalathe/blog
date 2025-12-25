import { useLocation } from 'react-router-dom';

function ShareButton({ title }) {
  const location = useLocation();
  const baseUrl = import.meta.env.VITE_BASE_URL || 'https://blog.dsalathe.dev';
  // Use pathname from useLocation instead of hash
  const fullUrl = `${baseUrl}/#${location.pathname}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: fullUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(fullUrl);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="share-button"
      aria-label="Share article"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
        <polyline points="16 6 12 2 8 6"/>
        <line x1="12" y1="2" x2="12" y2="15"/>
      </svg>
      Share
    </button>
  );
}

export default ShareButton;