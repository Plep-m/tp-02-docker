const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { SocksProxyAgent } = require('socks-proxy-agent');

const app = express();
const port = 5000;

app.use(cors({
  origin: 'http://localhost:3000'
}));

const agent = new SocksProxyAgent('socks5h://tor:9050');

app.get('/api/hello', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/user', async (req, res) => {
  try {
    const response = await axios.get(
      'https://randomuser.me/api/',
      {
        httpAgent: agent,
        httpsAgent: agent,
        proxy: false,
        timeout: 30000
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching through Tor:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch user data',
      message: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
