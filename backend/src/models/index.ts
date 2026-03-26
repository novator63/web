import Event from './Event.js';
import User from './User.js';

User.hasMany(Event, {
  foreignKey: 'createdBy',
  onDelete: 'CASCADE',
});

Event.belongsTo(User, {
  foreignKey: 'createdBy',
});

export { User, Event };
