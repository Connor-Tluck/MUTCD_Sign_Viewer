const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;
const IMAGES_DIR = path.join(__dirname, 'images', 'mutcd');

app.use(cors());
app.use('/images/mutcd', express.static(IMAGES_DIR, {
  maxAge: '30d', // Cache images for 30 days
}));

// Serve React frontend build
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// Fallback to React for any non-API route
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

// Helper to get all image files and codes
function getSignFiles() {
  const files = fs.readdirSync(IMAGES_DIR)
    .filter(f => /\.(gif|svg|png|jpg|jpeg)$/i.test(f));
  return files.map(filename => ({
    filename,
    code: filename.split('-')[0].replace(/\s.*$/, '') // e.g., "D1-1.gif" => "D"
  }));
}

// Endpoint: all signs
app.get('/api/signs', (req, res) => {
  res.json(getSignFiles());
});

// Endpoint: unique codes (first letter only)
app.get('/api/codes', (req, res) => {
  const codes = [...new Set(getSignFiles().map(f => f.code[0]))];
  res.json(codes);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});