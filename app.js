const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions.module.js');
const port = require('./config');
// Enable CORS with options from a separate configuration file
app.use(cors(corsOptions));

// Parse incoming JSON data in requests
app.use(express.json());

// Use Axios for making HTTP requests
const axios = require('axios');

// Include Helmet for improved security (consider keeping this)
const helmet = require('helmet');
app.use(helmet());

// Define Content Security Policy with specific rules (consider keeping this)
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "'unsafe-inline'", "example.com"],
      "img-src": ["'self'", "https: data:"]
    }
  })
);

// Route to handle search requests using iTunes API
app.get('/search', (req, res) => {
  // Build the API URL dynamically based on query parameters
  const URL = `https://itunes.apple.com/search?.term=${req.query.term}&media=${req.query.media ? req.query.media : ''}`;

  // Fetch data from iTunes using Axios
  axios.get(URL)
    .then((response) => {
      // Send response data in JSON format
      res.json(response.data);
    })
    .catch(err => {
      // Handle errors gracefully, sending a 404 status code
      res.status(404).send("An error occurred while fetching in the backend.");
    });
});

// Serve static files from the frontend build directory in production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));

  // Handle all other routes by serving the frontend's index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}
// Start the server and listen on the specified port
app.listen(port.EXPRESS_APP_PORT, () => {
  console.log(`App server listening at http://localhost:${port.EXPRESS_APP_PORT}`);
});

