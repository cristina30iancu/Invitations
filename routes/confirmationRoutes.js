const express = require('express');
const Invitation = require('../models/Invitation');
const router = express.Router();

// Ruta pentru confirmarea/refuzarea unei invitații
router.put('/confirm/:uniqueId', async (req, res) => {
  const { uniqueId } = req.params;
  const { status, name } = req.body;

  try {
    const updatedInvitation = await Invitation.findOneAndUpdate(
      { uniqueId },
      { status, name },
      { new: true }
    );

    if (!updatedInvitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    res.json(updatedInvitation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;