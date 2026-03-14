import { Event } from "../models/index.js";
import { Op } from "sequelize";

export const getAllEvents = async (req, res) => {
    try {
        const { search } = req.query;
        let whereClause = {};

        if (search) {
            whereClause = {
                [Op.or]: [
                    { title: { [Op.iLike]: `%${search}%` } },
                    { description: { [Op.iLike]: `%${search}%` } },
                ],
            };
        }

        const events = await Event.findAll({ where: whereClause });
        res.status(200).json(events);
    } catch (error) {
        res.status(400).json({ message: "Failed to fetch events", error: error.message });
    }
};

export const getEventById = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ message: "Failed to fetch event", error: error.message });
    }
};

export const createEvent = async (req, res) => {
    try {
        const { title, description, date, createdBy } = req.body;

        if (!title || !date || !createdBy) {
            return res.status(400).json({ message: "Title, date, and createdBy are required" });
        }

        const newEvent = await Event.create({ title, description, date, createdBy });
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ message: "Failed to create event", error: error.message });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const { title, description, date } = req.body;

        if (!title || !date || !event.createdBy) {
            return res.status(400).json({ message: "Title, date, and createdBy are required" });
        }

        await event.update({ title, description, date });
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ message: "Failed to update event", error: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        await event.destroy();
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Failed to delete event", error: error.message });
    }
};