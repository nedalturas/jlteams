const fs = require('fs');
const path = require('path');

// Read the template file
const configTemplate = fs.readFileSync('config.js', 'utf8');

// Replace environment variables
const configContent = configTemplate
    .replace('process.env.GOOGLE_SHEETS_ID', `"${process.env.GOOGLE_SHEETS_ID}"`)
    .replace('process.env.GOOGLE_SHEETS_API_KEY', `"${process.env.GOOGLE_SHEETS_API_KEY}"`);

// Write the processed file
fs.writeFileSync(path.join('dist', 'config.js'), configContent);