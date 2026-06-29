const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'pages');

const pages = [
  'SportsPage.tsx',
  'ScienceTechPage.tsx',
  'PoliticsPage.tsx',
  'LocalPage.tsx',
  'FifaWorldCupPage.tsx',
  'EntertainmentPage.tsx',
  'CountryPage.tsx',
  'BusinessPage.tsx'
];

pages.forEach(page => {
  const filePath = path.join(srcDir, page);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Add import if not present
    if (!content.includes('sortArticlesByDate')) {
        // Find the last import
        const lines = content.split('\n');
        let lastImportIdx = -1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('import ')) {
                lastImportIdx = i;
            }
        }
        if (lastImportIdx !== -1) {
            lines.splice(lastImportIdx + 1, 0, "import { sortArticlesByDate } from '../utils/sortArticles';");
            content = lines.join('\n');
        }
    }
    
    // Replace setLiveArticles(xxx) or setArticles(xxx)
    content = content.replace(/setLiveArticles\((.*?)\);/g, (match, group1) => {
        if (group1.includes('sortArticlesByDate')) return match;
        return `setLiveArticles(sortArticlesByDate(${group1}));`;
    });
    
    content = content.replace(/setArticles\((.*?)\);/g, (match, group1) => {
        if (group1.includes('sortArticlesByDate')) return match;
        if (group1 === '[]') return match; // don't wrap empty array
        return `setArticles(sortArticlesByDate(${group1}));`;
    });
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${page}`);
  }
});
