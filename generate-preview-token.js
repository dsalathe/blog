/**
 * Preview Token Generator
 * 
 * Simple utility to generate random preview tokens for draft articles.
 * Run with: node generate-preview-token.js
 */

function generatePreviewToken(length = 10) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    token += chars.charAt(randomIndex);
  }
  
  return token;
}

// Generate and display token
const token = generatePreviewToken();

console.log('\n🔑 Generated Preview Token:');
console.log('─'.repeat(40));
console.log(`   ${token}`);
console.log('─'.repeat(40));
console.log('\nAdd to your article frontmatter:');
console.log(`previewToken: "${token}"`);
console.log('\nExample preview URL:');
console.log(`#/blog/YOUR_POST_ID?preview=${token}`);
console.log();
