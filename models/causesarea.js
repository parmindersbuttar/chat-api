'use strict';
module.exports = (sequelize, DataTypes) => {
  const causesArea = sequelize.define('causesAreas', {
    causeAreaId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    causeAreaName: DataTypes.STRING,
    causeAreaImage: DataTypes.STRING,
    causeAreaDescription: DataTypes.STRING
    
  }, {
    freezeTableName: true
  });
  causesArea.associate = function(models) {
    // associations can be defined here
    causesArea.hasMany(models.userCausesAreas, {
      foreignKey : 'causeAreaId',
      targetKey: 'causeAreaId',
      as: 'UserCausesDetails'
  });
  };
  return causesArea;
};