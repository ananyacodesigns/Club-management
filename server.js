const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Use Express's built-in middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB URI - make sure this matches your local or remote MongoDB setup
const mongoURI = 'mongodb://localhost:27017/mydatabase';

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('Failed to connect to MongoDB:', err));

// Define a route for the root URL to welcome visitors
app.get('/', (req, res) => {
    res.send('Welcome to My App!');
});

// Serve the signup form at the /signup route
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/signup.html'); // Ensure the path to your HTML file is correct
});

// Handle form submissions to /submit-form
app.post('/submit-form', (req, res) => {
  console.log(req.body);
  const { name, strength, email, password } = req.body;
  if (!password) {
      return res.status(400).json({"error": "Password is required"});
  }
    // Assuming User is a Mongoose model you have set up in another file
  const User = require('./models/users'); // Ensure this path is correct

  const newUser = new User({
    name: req.body.name,
    strength: req.body.strength,
    email: req.body.email
  });

  newUser.save()
    .then(user => res.status(201).json(user))
    .catch(err => res.status(400).json(err));
});

// Handle requests to fetch all users from the database
app.get('/users', (req, res) => {
    const User = require('./models/users'); // Ensure this path is correct
    User.find()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json(err));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
