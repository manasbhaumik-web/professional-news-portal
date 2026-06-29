const fs = require('fs');
const path = require('path');

const files = [
  'server.ts',
  'src/pages/ScienceTechPage.tsx',
  'src/pages/PoliticsPage.tsx',
  'src/pages/LocalPage.tsx',
  'src/pages/EntertainmentPage.tsx',
  'src/pages/CountryPage.tsx',
  'src/pages/BusinessPage.tsx'
];

files.forEach(file => {
    let content = fs.readFileSync(path.join(__dirname, file), 'utf8');
    
    // Replace the problematic string globally
    const regex = /item\.pubDate \? new Date\(item\.pubDate\)\.toLocaleString\(\[\], \{ month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' \}\) : ('.*?')/g;
    
    content = content.replace(regex, 
        "(item.pubDate && !isNaN(new Date(item.pubDate).getTime())) ? new Date(item.pubDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : $1");
    
    fs.writeFileSync(path.join(__dirname, file), content, 'utf8');
});

console.log('Fixed toLocaleString calls');
