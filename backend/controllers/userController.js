import { User } from '../models/index.js';

export const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        const exitstingUser = await User.findOne({ where: { email } });

        if (exitstingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const newUser = await User.create({ name, email });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: "Failed to create user", error: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: "Failed to fetch users", error: error.message });
    }
};