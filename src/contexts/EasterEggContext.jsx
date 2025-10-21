import { createContext, useContext, useState } from 'react';

const EasterEggContext = createContext();

export const useEasterEgg = () => {
  const context = useContext(EasterEggContext);
  if (!context) {
    throw new Error('useEasterEgg must be used within an EasterEggProvider');
  }
  return context;
};

export const EasterEggProvider = ({ children }) => {
  // State resets on page refresh - no persistence
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [previewedPostIds, setPreviewedPostIds] = useState(new Set());

  const unlock = () => {
    setIsUnlocked(true);
  };

  const unlockPreview = (postId) => {
    setPreviewedPostIds(prev => new Set([...prev, postId]));
  };

  const canAccessPost = (postId, publishedDate) => {
    const postDate = new Date(publishedDate);
    const now = new Date();
    
    // Allow if: published, dev mode, easter egg unlocked, or specifically previewed
    return postDate <= now || 
           import.meta.env.MODE === 'development' || 
           isUnlocked || 
           previewedPostIds.has(postId);
  };

  return (
    <EasterEggContext.Provider value={{ 
      isUnlocked, 
      unlock, 
      unlockPreview, 
      canAccessPost,
      previewedPostIds 
    }}>
      {children}
    </EasterEggContext.Provider>
  );
};
