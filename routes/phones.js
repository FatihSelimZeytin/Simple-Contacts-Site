const express = require('express');
const router = express.Router();
const { Phone, Contact } = require('../models');

const MOCK_USER_ID = 1;

// CREATE phone for a contact (only if contact belongs to user)
router.post('/', async (req, res) => {
  try {
    const { contactId, number } = req.body;
    // Check contact belongs to user
    const contact = await Contact.findOne({ where: { id: contactId, userId: MOCK_USER_ID } });
    if (!contact) return res.status(404).json({ error: 'Contact not found or unauthorized' });

    const phone = await Phone.create({ contactId, number });
    res.status(201).json(phone);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ phones for a contact (only if contact belongs to user)
router.get('/contact/:contactId', async (req, res) => {
  try {
    const contact = await Contact.findOne({ where: { id: req.params.contactId, userId: MOCK_USER_ID } });
    if (!contact) return res.status(404).json({ error: 'Contact not found or unauthorized' });

    const phones = await Phone.findAll({ where: { contactId: req.params.contactId } });
    res.json(phones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE phone by ID (check ownership via contact)
router.put('/:id', async (req, res) => {
  try {
    const phone = await Phone.findByPk(req.params.id, { include: [Contact] });
    if (!phone) return res.status(404).json({ error: 'Phone not found' });
    if (phone.Contact.userId !== MOCK_USER_ID) return res.status(403).json({ error: 'Unauthorized' });

    await phone.update(req.body);
    res.json(phone);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE phone by ID (check ownership via contact)
router.delete('/:id', async (req, res) => {
  try {
    const phone = await Phone.findByPk(req.params.id, { include: [Contact] });
    if (!phone) return res.status(404).json({ error: 'Phone not found' });
    if (phone.Contact.userId !== MOCK_USER_ID) return res.status(403).json({ error: 'Unauthorized' });

    await phone.destroy();
    res.json({ message: 'Phone deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
