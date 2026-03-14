import User from "./User.js";
import Event from "./Event.js";

User.hasMany(Event, {
    foreignKey: "createdBy",
    onDelete: "CASCADE",
});

Event.belongsTo(User, {
    foreignKey: "createdBy",
});

export { User, Event };