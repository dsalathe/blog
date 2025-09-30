import React, { useEffect, useState } from 'react';

function ImageModal({ isOpen, onClose, imageSrc, imageAlt }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoaded(false);
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for closing animation to finish before actually closing
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // Match the CSS transition duration
  };

  const handleBackdropClick = (event) => {
    // Only close if clicking directly on the backdrop, not the image
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className={`image-modal-backdrop ${isClosing ? 'closing' : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged image view"
    >
      <div className="image-modal-container">
        {/* Close button */}
        <button
          className="image-modal-close"
          onClick={handleClose}
          aria-label="Close image modal"
          title="Close (ESC)"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        {/* Image container */}
        <div className={`image-modal-content ${isLoaded ? 'loaded' : ''} ${isClosing ? 'closing' : ''}`}>
          <img
            src={imageSrc}
            alt={imageAlt || 'Enlarged view'}
            onLoad={handleImageLoad}
            className="image-modal-image"
          />
          
          {/* Loading spinner */}
          {!isLoaded && (
            <div className="image-modal-loading">
              <div className="loading-spinner"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageModal;