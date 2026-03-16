import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';    

const BlacklistedToken = sequelize.define('BlacklistedToken', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    updatedAt: false
});

export default BlacklistedToken;