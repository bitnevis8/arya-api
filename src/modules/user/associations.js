const User = require("./user/model");
const Role = require("./role/model");
const { DataTypes } = require("sequelize");
const sequelize = require("../../core/database/mysql/connection");

// ارتباط User و Role (One-to-Many)
User.belongsTo(Role, { 
  foreignKey: "roleId", 
  as: "role",
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
Role.hasMany(User, { foreignKey: "roleId", as: "users" });

module.exports = {
  User,
  Role
}; 