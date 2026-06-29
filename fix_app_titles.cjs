const fs = require('fs');
const path = require('path');

const fullPath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(fullPath, 'utf8');

// Replace a.title.toLowerCase() -> (a.title || '').toLowerCase()
content = content.replace(/a\.title\.toLowerCase\(\)/g, "(a.title || '').toLowerCase()");

// Replace art.title.toLowerCase() -> (art.title || '').toLowerCase()
content = content.replace(/art\.title\.toLowerCase\(\)/g, "(art.title || '').toLowerCase()");

// Replace art.summary?.toLowerCase() -> (art.summary || '').toLowerCase()
content = content.replace(/art\.summary\?\.toLowerCase\(\)/g, "(art.summary || '').toLowerCase()");

// Replace art.summary.toLowerCase() -> (art.summary || '').toLowerCase()
content = content.replace(/art\.summary\.toLowerCase\(\)/g, "(art.summary || '').toLowerCase()");

// Replace art.category.toLowerCase() -> (art.category || '').toLowerCase()
content = content.replace(/art\.category\.toLowerCase\(\)/g, "(art.category || '').toLowerCase()");

fs.writeFileSync(fullPath, content, 'utf8');
console.log('Fixed App.tsx');
