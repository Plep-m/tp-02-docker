const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');

const app = express();
const PORT = 3000;
const BACKEND_URL = 'http://backend:5000';

const template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf-8');

app.get('/', async (req, res) => {
  let replacement;
  
  try {
    const data = await new Promise((resolve, reject) => {
      http.get(`${BACKEND_URL}/api/hello`, (response) => {
        let body = '';
        response.on('data', chunk => body += chunk);
        response.on('end', () => {
          if (response.statusCode !== 200) {
            reject(new Error(`HTTP ${response.statusCode}`));
          } else {
            resolve(body);
          }
        });
      }).on('error', reject);
    });
    replacement = `<pre id="output">${data}</pre>`;
  } catch (err) {
    replacement = `<pre id="output">Error: ${err.message}</pre>`;
  }

  const html = template.replace('<!-- REPLACE_BLOCK -->', replacement);
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});
