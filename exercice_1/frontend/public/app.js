fetch('http://localhost:5000/api/hello')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.text();
  })
  .then(text => {
    document.getElementById('output').textContent = text;
  })
  .catch(err => {
    document.getElementById('output').textContent =
      'Error: ' + err.message;
  });
