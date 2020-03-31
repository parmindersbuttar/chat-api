'use strict';
module.exports = (sequelize, DataTypes) => {
  const feedback = sequelize.define('feedbacks', {
    feedbackId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
          model: 'users',
          key: 'userId'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    feedback	: DataTypes.STRING
  }, {
    freezeTableName: true
  });
  feedback.associate = function(models) {
    // associations can be defined here
    feedback.belongsTo(models.users, {
      foreignKey : 'userId',
      targetKey: 'userId',
      as: 'feedbk'
      });
  };
  return feedback;
};