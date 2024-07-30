const express = require('express');
const Event = require('../models/Event');
const authMiddleware = require('../authMiddleware');
const router = express.Router();

router.get('', authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Eroare la obținerea evenimentelor' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findOne({ user: req.user.id, _id: req.params.id });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Eroare la obținerea evenimentelor' });
  }
});

router.get('/confirm/:id', async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Eroare la obținerea evenimentelor' });
  }
});

// Ruta pentru crearea unui eveniment
router.post('', async (req, res) => {
  const { userId, name, description, location, date, contactPerson } = req.body;

  try {
    const newEvent = new Event({
      user: userId,
      name,
      description,
      location,
      date,
      contactPerson
    });

    const savedEvent = await newEvent.save();
    res.json(savedEvent);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const result = await Event.findByIdAndDelete(eventId);

    if (!result) {
      return res.status(404).json({ message: 'Evenimentul nu a fost găsit' });
    }

    res.status(200).json({ message: 'Eveniment șters cu succes!' });
  } catch (error) {
    res.status(500).json({ message: 'Eroare la ștergerea evenimentului: ' + error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const updateData = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, { new: true });

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Evenimentul nu a fost găsit' });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Eroare la actualizarea evenimentului: ' + error.message });
  }
});

module.exports = router;