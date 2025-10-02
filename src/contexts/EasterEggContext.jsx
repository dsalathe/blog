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

  const unlock = () => {
    setIsUnlocked(true);
  };

  return (
    <EasterEggContext.Provider value={{ isUnlocked, unlock }}>
      {children}
    </EasterEggContext.Provider>
  );
};
