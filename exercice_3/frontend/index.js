const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const BACKEND_URL = 'http://backend:5000';

const template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf-8');

function httpGetJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
        } else {
          try {
            resolve(JSON.parse(body));
          } catch (err) {
            reject(new Error('Failed to parse JSON'));
          }
        }
      });
    }).on('error', reject);
  });
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

app.get('/', async (req, res) => {
  let html = template;
  
  try {
    const data = await httpGetJson(`${BACKEND_URL}/api/user`);
    const user = data.results[0];
    
    const profilePic = `<img id="profilePic" src="${escapeHtml(user.picture.large)}" alt="${escapeHtml(user.name.first)} ${escapeHtml(user.name.last)}" width="128" height="128" border="1" />`;
    
    const apiInfo = `
      <tr>
        <td>Seed</td>
        <td>${escapeHtml(data.info.seed)}</td>
      </tr>
      <tr>
        <td>Results</td>
        <td>${escapeHtml(data.info.results)}</td>
      </tr>
      <tr>
        <td>Page</td>
        <td>${escapeHtml(data.info.page)}</td>
      </tr>
      <tr>
        <td>Version</td>
        <td>${escapeHtml(data.info.version)}</td>
      </tr>
    `;

    const userDetails = `
      <tr>
        <td>Gender</td>
        <td>${escapeHtml(user.gender)}</td>
      </tr>
      <tr>
        <td>Name</td>
        <td>${escapeHtml(user.name.title)} ${escapeHtml(user.name.first)} ${escapeHtml(user.name.last)}</td>
      </tr>
      <tr>
        <td>Email</td>
        <td>${escapeHtml(user.email)}</td>
      </tr>
      <tr>
        <td>Phone</td>
        <td>${escapeHtml(user.phone)}</td>
      </tr>
      <tr>
        <td>Cell</td>
        <td>${escapeHtml(user.cell)}</td>
      </tr>
      <tr>
        <td>Date of Birth</td>
        <td>${escapeHtml(new Date(user.dob.date).toLocaleDateString())} (Age: ${escapeHtml(user.dob.age)})</td>
      </tr>
      <tr>
        <td>Registered</td>
        <td>${escapeHtml(new Date(user.registered.date).toLocaleDateString())} (${escapeHtml(user.registered.age)} years ago)</td>
      </tr>
      <tr>
        <td>Street</td>
        <td>${escapeHtml(user.location.street.number)} ${escapeHtml(user.location.street.name)}</td>
      </tr>
      <tr>
        <td>City</td>
        <td>${escapeHtml(user.location.city)}</td>
      </tr>
      <tr>
        <td>State</td>
        <td>${escapeHtml(user.location.state)}</td>
      </tr>
      <tr>
        <td>Country</td>
        <td>${escapeHtml(user.location.country)}</td>
      </tr>
      <tr>
        <td>Postcode</td>
        <td>${escapeHtml(user.location.postcode)}</td>
      </tr>
      <tr>
        <td>Coordinates</td>
        <td>Lat: ${escapeHtml(user.location.coordinates.latitude)}, Lon: ${escapeHtml(user.location.coordinates.longitude)}</td>
      </tr>
      <tr>
        <td>Timezone</td>
        <td>${escapeHtml(user.location.timezone.offset)} - ${escapeHtml(user.location.timezone.description)}</td>
      </tr>
      <tr>
        <td>Username</td>
        <td>${escapeHtml(user.login.username)}</td>
      </tr>
      <tr>
        <td>UUID</td>
        <td>${escapeHtml(user.login.uuid)}</td>
      </tr>
      <tr>
        <td>Nationality</td>
        <td>${escapeHtml(user.nat)}</td>
      </tr>
    `;
    
    html = html.replace('<!-- PROFILE_PIC -->', profilePic);
    html = html.replace('<!-- API_INFO -->', apiInfo);
    html = html.replace('<!-- USER_DETAILS -->', userDetails);
    html = html.replace('<!-- ERROR -->', '');
    
  } catch (err) {
    html = html.replace('<!-- PROFILE_PIC -->', '');
    html = html.replace('<!-- API_INFO -->', '<tr><td colspan="2">Error loading data</td></tr>');
    html = html.replace('<!-- USER_DETAILS -->', '<tr><td colspan="2">Error loading data</td></tr>');
    html = html.replace('<!-- ERROR -->', `<p id="error">Error: ${escapeHtml(err.message)}</p>`);
  }
  
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});
