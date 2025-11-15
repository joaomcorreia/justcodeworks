// Fix routing conflicts by removing conflicting directories
const fs = require('fs');
const path = require('path');

const conflictingDirectories = [
  'C:\\projects\\justcodeworks\\frontend\\src\\app\\[locale]\\admin\\sites\\[id]',
  'C:\\projects\\justcodeworks\\frontend\\src\\app\\[locale]\\admin\\templates\\[templateId]'
];

conflictingDirectories.forEach(dirPath => {
  if (fs.existsSync(dirPath)) {
    console.log(`Removing conflicting directory: ${dirPath}`);
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`✓ Removed: ${dirPath}`);
  } else {
    console.log(`Directory not found: ${dirPath}`);
  }
});

console.log('Routing conflict resolution completed.');