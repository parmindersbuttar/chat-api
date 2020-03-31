'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Roles', {
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    roleName: DataTypes.STRING,
    roleDescription: DataTypes.STRING
  }, {
    freezeTableName: true
  });
  Role.associate = function(models) {
    // associations can be defined here
    Role.hasMany(models.userRoles, {
      foreignKey : 'roleId',
      targetKey: 'roleId',
      as: 'RoleDetail'
    });
  };
  return Role;
};