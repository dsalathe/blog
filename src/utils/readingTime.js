/**
 * Calculate the estimated reading time for a given text
 * @param {string} content - The content to analyze
 * @param {number} wordsPerMinute - Average reading speed in words per minute
 * @returns {string} - Formatted reading time string
 */
export const calculateReadingTime = (content, wordsPerMinute = 200) => {
  // Return early if no content
  if (!content) return '< 1 min read';
  
  // Count words by splitting on whitespace
  const words = content.trim().split(/\s+/).length;
  
  // Calculate reading time in minutes
  const minutes = Math.ceil(words / wordsPerMinute);
  
  // Format the output
  if (minutes < 1) return '< 1 min read';
  return `${minutes} min read`;
};