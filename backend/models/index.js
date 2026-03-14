import User from "./User";
import Event from "./Event";

User.hasMany(Event, {
    foreignKey: "createdBy",
    onDelete: "CASCADE",
});

Event.belongsTo(User, {
    foreignKey: "createdBy",
});

export { User, Event };