fetch('http://localhost:5000/api/user')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    const user = data.results[0];
    
    document.getElementById('seed').textContent = data.info.seed;
    document.getElementById('results').textContent = data.info.results;
    document.getElementById('page').textContent = data.info.page;
    document.getElementById('version').textContent = data.info.version;
    
    document.getElementById('profilePic').src = user.picture.large;
    document.getElementById('profilePic').alt = `${user.name.first} ${user.name.last}`;
    
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = `
      <tr>
        <td>Gender</td>
        <td>${user.gender}</td>
      </tr>
      <tr>
        <td>Name</td>
        <td>${user.name.title} ${user.name.first} ${user.name.last}</td>
      </tr>
      <tr>
        <td>Email</td>
        <td>${user.email}</td>
      </tr>
      <tr>
        <td>Phone</td>
        <td>${user.phone}</td>
      </tr>
      <tr>
        <td>Cell</td>
        <td>${user.cell}</td>
      </tr>
      <tr>
        <td>Date of Birth</td>
        <td>${new Date(user.dob.date).toLocaleDateString()} (Age: ${user.dob.age})</td>
      </tr>
      <tr>
        <td>Registered</td>
        <td>${new Date(user.registered.date).toLocaleDateString()} (${user.registered.age} years ago)</td>
      </tr>
      <tr>
        <td>Street</td>
        <td>${user.location.street.number} ${user.location.street.name}</td>
      </tr>
      <tr>
        <td>City</td>
        <td>${user.location.city}</td>
      </tr>
      <tr>
        <td>State</td>
        <td>${user.location.state}</td>
      </tr>
      <tr>
        <td>Country</td>
        <td>${user.location.country}</td>
      </tr>
      <tr>
        <td>Postcode</td>
        <td>${user.location.postcode}</td>
      </tr>
      <tr>
        <td>Coordinates</td>
        <td>Lat: ${user.location.coordinates.latitude}, Lon: ${user.location.coordinates.longitude}</td>
      </tr>
      <tr>
        <td>Timezone</td>
        <td>${user.location.timezone.offset} - ${user.location.timezone.description}</td>
      </tr>
      <tr>
        <td>Username</td>
        <td>${user.login.username}</td>
      </tr>
      <tr>
        <td>UUID</td>
        <td>${user.login.uuid}</td>
      </tr>
      <tr>
        <td>Nationality</td>
        <td>${user.nat}</td>
      </tr>
    `;
  })
  .catch(err => {
    document.getElementById('error').textContent = 'Error: ' + err.message;
  });
