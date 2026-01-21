const express = require('express');
const http = require('http');

const app = express();
const PORT = 3000;
const BACKEND_URL = 'http://backend:5000';

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.json());

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
        } else {
          resolve(JSON.parse(body));
        }
      });
    }).on('error', reject);
  });
}

app.get('/', async (req, res) => {
  try {
    const users = await httpGet(`${BACKEND_URL}/api/users`);
    res.render('index', { users, error: null });
  } catch (err) {
    res.render('index', { users: [], error: err.message });
  }
});

app.all(/^\/api\/.*/, (req, res) => {
  const apiPath = req.path.replace('/api', '');
  const backendApiUrl = `${BACKEND_URL}/api${apiPath}`;
  
  const options = {
    method: req.method,
    headers: req.headers
  };

  const proxyReq = http.request(backendApiUrl, options, (backendRes) => {
    res.status(backendRes.statusCode);
    backendRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    res.status(500).json({ error: err.message });
  });

  if (req.body && Object.keys(req.body).length > 0) {
    proxyReq.write(JSON.stringify(req.body));
  }
  
  proxyReq.end();
});

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});
