const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else {
            if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
                results.push(fullPath);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // In mappers: title: item.title -> title: (item.title || '').replace(/\bFeeds?\b/gi, '').replace(/\s+/g, ' ').trim(),
    const modified = content.replace(/title:\s*item\.title,/g, "title: (item.title || '').replace(/\\bFeeds?\\b/gi, '').replace(/\\s+/g, ' ').trim(),");
    
    // If it's ArticleCard.tsx, also fix it there just in case static articles have it
    let finalContent = modified;
    if (file.endsWith('ArticleCard.tsx')) {
        finalContent = finalContent.replace(/{art\.title}/g, "{art.title.replace(/\\bFeeds?\\b/gi, '').replace(/\\s+/g, ' ').trim()}");
    }
    // ArticleReaderModal.tsx
    if (file.endsWith('ArticleReaderModal.tsx')) {
        finalContent = finalContent.replace(/{selectedArticle\.title}/g, "{selectedArticle.title.replace(/\\bFeeds?\\b/gi, '').replace(/\\s+/g, ' ').trim()}");
    }
    
    if (finalContent !== content) {
        fs.writeFileSync(file, finalContent, 'utf8');
        console.log(`Updated ${file}`);
    }
});
