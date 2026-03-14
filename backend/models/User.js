import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

// 6.1 создание модели данных "Пользователь"
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,             // 6.2 проверить уникальность email
      validate: {
        isEmail: true,
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    updatedAt: false
  }
);

export default User;