'use strict';
module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    conversationId: DataTypes.STRING,
    message: DataTypes.STRING,
    isred: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});
  message.associate = function(models) {
    // associations can be defined here
    message.belongsTo(models.users, {
      foreignKey: 'senderId',
      as: 'UsenderId'
    });
    
    message.belongsTo(models.users, {
      foreignKey: 'receiverId',
      as: 'UrecvrId'
    });
  };
  return message;
};
