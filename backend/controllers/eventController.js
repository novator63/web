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
        const { title, description, date } = req.body;

        if (!title || !date) {
            return res.status(400).json({ message: "Title and date are required" });
        }

        const newEvent = await Event.create({ title, description, date, createdBy: req.user.id });
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ message: "Failed to create event", error: error.message });
    }
};
// TO DO брать информацию из jwt токена для операций. пользователь может работать только со своими событиями
// брать информацию из payload токена, который передается в req.user после аутентификации через passport. 
// И использовать эту информацию для создания, обновления и удаления событий, чтобы гарантировать, что пользователь
// может работать только со своими событиями. Например, при создании события можно установить поле createdBy равным id пользователя из токена,
// а при обновлении и удалении проверять, что событие принадлежит этому пользователю.

export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findOne({ where: { id: req.params.id, createdBy: req.user.id } });

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
        const event = await Event.findOne({ where: { id: req.params.id, createdBy: req.user.id } });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        await event.destroy();
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Failed to delete event", error: error.message });
    }
};