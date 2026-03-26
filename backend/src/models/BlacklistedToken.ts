import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import sequelize from '../config/db.js';

class BlacklistedToken extends Model<
  InferAttributes<BlacklistedToken>,
  InferCreationAttributes<BlacklistedToken>
> {
  declare id: CreationOptional<number>;
  declare token: string;
  declare createdAt: CreationOptional<Date>;
}

BlacklistedToken.init(
  {
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
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'BlacklistedToken',
    updatedAt: false,
  },
);

export default BlacklistedToken;
