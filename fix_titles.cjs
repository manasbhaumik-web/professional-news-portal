const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, 'utf8');

    // Replace a.title.toLowerCase() -> (a.title || '').toLowerCase()
    content = content.replace(/a\.title\.toLowerCase\(\)/g, "(a.title || '').toLowerCase()");
    
    // Replace art.title.toLowerCase() -> (art.title || '').toLowerCase()
    content = content.replace(/art\.title\.toLowerCase\(\)/g, "(art.title || '').toLowerCase()");
    
    // Replace art.summary?.toLowerCase() -> (art.summary || '').toLowerCase()
    content = content.replace(/art\.summary\?\.toLowerCase\(\)/g, "(art.summary || '').toLowerCase()");

    // Replace art.summary.toLowerCase() -> (art.summary || '').toLowerCase()
    content = content.replace(/art\.summary\.toLowerCase\(\)/g, "(art.summary || '').toLowerCase()");

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Fixed', file);
}
