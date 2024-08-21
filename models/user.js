'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Event, { as: 'organizedEvents', foreignKey: 'organizerId' });
      User.belongsToMany(models.Event, { through: 'EventAttendee', as: 'attendedEvents' });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('student', 'planner'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
