const fs = require('fs');
const path = require('path');

const utilCode = `export const formatLocalTime = (dateStr: string, publishedAt?: string) => {
    if (!dateStr || dateStr === "Just Now") return dateStr || "";
    const dateToUse = publishedAt ? new Date(publishedAt) : new Date(dateStr);
    if (isNaN(dateToUse.getTime())) return dateStr;
    return dateToUse.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};
`;
fs.writeFileSync(path.join(__dirname, 'src/utils/formatLocalTime.ts'), utilCode);

const components = [
  'TopNewsSection.tsx',
  'SidebarComponents.tsx',
  'MainAdBanner.tsx',
  'CategorizedHighlightsSection.tsx',
  'ArticleReaderModal.tsx',
  'ArticleCard.tsx'
];

components.forEach(file => {
  const p = path.join(__dirname, 'src/components', file);
  if (!fs.existsSync(p)) return;
  
  let content = fs.readFileSync(p, 'utf8');
  
  if (!content.includes('formatLocalTime')) {
     const importStmt = "import { formatLocalTime } from '../utils/formatLocalTime';\n";
     const lines = content.split('\n');
     let lastImportIdx = -1;
     for(let i=0; i<lines.length; i++) {
        if(lines[i].startsWith('import ')) lastImportIdx = i;
     }
     lines.splice(lastImportIdx + 1, 0, importStmt);
     content = lines.join('\n');
  }

  // Replace {art.timeAgo || art.date}
  content = content.replace(/\{(\w+)\.timeAgo \|\| \1\.date\}/g, "{$1.timeAgo || formatLocalTime($1.date, $1.publishedAt)}");
  
  // Replace {art.date}
  content = content.replace(/\{(\w+)\.date\}/g, "{formatLocalTime($1.date, $1.publishedAt)}");
  
  // Replace article.date where it might be standalone
  content = content.replace(/article\.date/g, function(match, offset, string) {
      // Don't replace if it's already wrapped in formatLocalTime
      if (string.substring(offset - 16, offset) === 'formatLocalTime(') return match;
      if (string.substring(offset, offset + 12) === 'article.date') {
          // If it's part of `article.timeAgo || article.date` which we already covered, skip.
          return match;
      }
      return match;
  });

  // Re-run for CategorizedHighlightsSection.tsx specifically because it has {article.timeAgo || article.date}
  content = content.replace(/\{article\.timeAgo \|\| article\.date\}/g, "{article.timeAgo || formatLocalTime(article.date, article.publishedAt)}");
  
  fs.writeFileSync(p, content);
  console.log('Updated', file);
});
