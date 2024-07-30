const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 8080;
const dbURI = process.env.MONGODB_URI;
app.use(cors());
app.use(express.json());

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Import routes
const invitationRoutes = require('./routes/invitationRoutes.js');
const eventRoutes = require('./routes/eventRoutes.js');
const confirmationRoutes = require('./routes/confirmationRoutes.js');
const authRoutes = require('./routes/authRoutes.js');

app.use('/api/invitations', invitationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/confirmation', confirmationRoutes);
app.use('/api/auth', authRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));