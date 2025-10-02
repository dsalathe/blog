import { useEffect } from 'react';

function Toast({ message, isVisible, onClose, duration = 5000 }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  return (
    <div className="toast-container">
      <div className="toast">
        <div className="toast-icon">🧭</div>
        <div className="toast-content">
          <div className="toast-title">Hidden Peak Unlocked!</div>
          <div className="toast-message">{message}</div>
        </div>
        <button className="toast-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
}

export default Toast;
