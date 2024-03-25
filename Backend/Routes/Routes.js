const express = require('express');
const router = express.Router();

const Activity = require('../models/Activity');

// Get all activities
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.find();
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new activity
router.post('/', async (req, res) => {
  const activity = new Activity({
    title: req.body.title,
    description: req.body.description,
    url: req.body.url,
  });

  try {
    const newActivity = await activity.save();
    res.status(201).json(newActivity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
