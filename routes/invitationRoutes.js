const express = require('express');
const router = express.Router();
const Invitation = require('../models/Invitation');
const authMiddleware = require('../authMiddleware');
const requestIp = require('request-ip');

// Obține toate invitațiile pentru un eveniment
router.get('/:eventId', authMiddleware, async (req, res) => {
  try {
    const invitations = await Invitation.find({ event: req.params.eventId }).populate('event');
    res.json(invitations);
  } catch (error) {
    res.status(500).json({ message: 'Eroare la obținerea invitațiilor: ' + error.message });
  }
});

router.get('/token/:eventId', async (req, res) => {
  try {
    const invitations = await Invitation.findOne({ event: req.params.eventId }).populate('event');
    if (!invitations) {
      return res.status(404).json({ message: 'Invitația nu a fost găsită' });
    }
    res.json(invitations);
  } catch (error) {
    res.status(500).json({ message: 'Eroare la obținerea invitației: ' + error.message });
  }
});

// Confirmă sau respinge o invitație
router.put('/token/:eventId', async (req, res) => {
  try {
      const { status, name } = req.body;
      const clientIp = requestIp.getClientIp(req);

      const invitation = await Invitation.findOne({ 'respondedIPs.ip': clientIp });
      if (invitation) {
          return res.status(400).json({ message: 'Ai răspuns deja la această invitație' });
      }

      // Dacă nu există un răspuns pentru acest IP, creăm unul nou
      const newInvitation = new Invitation({
          event: req.params.eventId,  // Trebuie să primești eventId din cerere
          name,
          status,
          respondedIPs: [{ ip: clientIp, name, status }]
      });

      await newInvitation.save();

      res.json(newInvitation);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Eroare la actualizarea invitației: ' + error.message });
  }
});
// Creează o invitație
router.post('', authMiddleware, async (req, res) => {
  const { eventId, name } = req.body;

  try {
    const newInvitation = new Invitation({
      event: eventId,
      name,
    });

    const savedInvitation = await newInvitation.save();
    res.json(savedInvitation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Șterge o invitație
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await Invitation.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Invitația nu a fost găsită' });
    }
    res.status(200).json({ message: 'Invitație ștearsă cu succes!' });
  } catch (error) {
    res.status(500).json({ message: 'Eroare la ștergerea invitației: ' + error.message });
  }
});

module.exports = router;
