const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('apps/web/src', (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  content = content.replace(/href="\/demo"/g, 'href="/overview"');
  content = content.replace(/Run Bengaluru 2035 Demo/gi, 'Launch Command Center');
  content = content.replace(/SIH 2025 Innovation Prototype/gi, 'Urban Intelligence Platform V2.0');
  content = content.replace(/System Mock Simulation/gi, 'Active Production Mode');
  content = content.replace(/Demo Mode/gi, 'Simulation Engine');
  content = content.replace(/Mock/g, 'Live');
  content = content.replace(/Prototype/g, 'Platform');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Updated', filePath);
  }
});
