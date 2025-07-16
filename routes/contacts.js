const express = require('express');
const router = express.Router();
const { Contact, Phone } = require('../models');
const { Op, fn, col, where } = require('sequelize'); // destructure what we need
const authMiddleware = require('../middleware/auth');
router.use(authMiddleware);

// CREATE a contact with multiple phone numbers
router.post('/', async (req, res) => {
  try {
    const { firstName, surname, company, phones } = req.body;

    const contact = await Contact.create({
      firstName,
      surname,
      company,
      userId: req.user.id,
    });

    if (Array.isArray(phones)) {
      const phonePromises = phones.map((number) =>
          Phone.create({ number, contactId: contact.id })
      );
      await Promise.all(phonePromises);
    }

    const result = await Contact.findByPk(contact.id, { include: Phone });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all contacts of the current user
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      where: { userId: req.user.id },
      include: Phone,
    });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a contact
router.put('/', async (req, res) => {
  try {
    const { searchFirstName, searchSurname, firstName, surname, company, phones } = req.body;

    if (!searchFirstName || !searchSurname) {
      return res.status(400).json({ error: 'searchFirstName and searchSurname required' });
    }

    // Case-insensitive search:
    const contact = await Contact.findOne({
      where: {
        userId: req.user.id,
        [Op.and]: [
          where(fn('lower', col('firstName')), searchFirstName.toLowerCase()),
          where(fn('lower', col('surname')), searchSurname.toLowerCase()),
        ],
      }
    });

    if (!contact) return res.status(404).json({ error: 'Contact not found' });

    // Prepare update fields, only update provided ones
    const updatedFields = {};
    if (firstName) updatedFields.firstName = firstName;
    if (surname) updatedFields.surname = surname;
    if (company) updatedFields.company = company;

    await contact.update(updatedFields);

    if (Array.isArray(phones)) {
      // Delete old phones and create new ones
      await Phone.destroy({ where: { contactId: contact.id } });
      const phonePromises = phones.map(number =>
          Phone.create({ number, contactId: contact.id })
      );
      await Promise.all(phonePromises);
    }

    const updatedContact = await Contact.findByPk(contact.id, { include: Phone });
    res.json(updatedContact);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a contact (parameters in query string)
router.delete('/', async (req, res) => {
  try {
    const { firstName, surname } = req.query; // from query instead of body

    if (!firstName || !surname) {
      return res.status(400).json({ error: 'firstName and surname required' });
    }

    // Case-insensitive search:
    const contact = await Contact.findOne({
      where: {
        userId: req.user.id,
        [Op.and]: [
          where(fn('lower', col('firstName')), firstName.toLowerCase()),
          where(fn('lower', col('surname')), surname.toLowerCase()),
        ],
      }
    });

    if (!contact) return res.status(404).json({ error: 'Contact not found' });

    await contact.destroy();
    res.json({ message: 'Contact deleted' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Search query is required' });

    const query = q.trim().toLowerCase();
    const queryParts = query.split(' ').filter(Boolean);

    // Build search conditions for names and company
    const contactConditions = queryParts.map(part => ({
      [Op.or]: [
        { firstName: { [Op.like]: `%${part}%` } },
        { surname: { [Op.like]: `%${part}%` } },
        { company: { [Op.like]: `%${part}%` } },
      ]
    }));

    // Fetch contacts where ANY contact field OR ANY phone matches
    const contacts = await Contact.findAll({
      where: {
        userId: req.user.id,
        [Op.or]: [
          ...contactConditions,
          ...queryParts.map(part => ({
            '$Phones.number$': { [Op.like]: `%${part}%` }
          })),
        ],
      },
      include: [{
        model: Phone,
        as: 'Phones',
        required: false,
      }],
    });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
