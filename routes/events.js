const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Event, User, EventAttendee } = require('../models');  // Adjust the path according to your structure

// Authentication middleware
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Get all events
router.get('/', auth, async (req, res) => {
    try {
        const events = await Event.findAll({
            include: [
                { model: User, as: 'organizer', attributes: ['username'] },
                { model: User, as: 'attendees', attributes: ['username'] }
            ]
        });
        res.json(events);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create an event
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'planner') {
        return res.status(403).send('Access denied');
    }

    const { title, description, date, location } = req.body;
    try {
        const newEvent = await Event.create({
            title,
            description,
            date,
            location,
            organizerId: req.user.id
        });
        res.json(newEvent);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Enroll in an event
router.post('/:eventId/enroll', auth, async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.eventId);
        if (!event) {
            return res.status(404).send('Event not found');
        }
        
        await EventAttendee.create({
            UserId: req.user.id,
            EventId: event.id
        });
        
        res.send('Enrolled successfully');
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete an event
router.delete('/:eventId', auth, async (req, res) => {
    console.log('Delete route hit');
    console.log('Event ID:', req.params.eventId);
    try {
        const event = await Event.findByPk(req.params.eventId);
        if (!event) {
            console.log('Event not found');
            return res.status(404).json({ msg: 'Event not found' });
        }
        
        if (req.user.role !== 'planner') {
            console.log('Access denied');
            return res.status(403).json({ msg: 'Access denied' });
        }

        await event.destroy();
        res.json({ msg: 'Event deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
