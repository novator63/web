import express from "express";
import User from "../models/User.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ message: "Fill in all fields" });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    await User.create({ email, name, password });

    res.status(201).json({ message: "Registration successful" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  // 1. Эндпоинт принимает email и пароль
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Заполните все поля" });
  }

  try {
    // 2. По email ищем пользователя в базе данных
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Пользователь не найден" });
    }

    // 3. Проверяем пароль: сравниваем введённый пароль с хешем из БД
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Неверный пароль" });
    }

    // 4. При успешной аутентификации генерируем JWT и отправляем клиенту
    // 5. Токен содержит данные пользователя и срок действия
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Авторизация успешна",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;