'use strict';
module.exports = (sequelize, DataTypes) => {
  const userRole = sequelize.define('userRoles', {
    userRoleId: {
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
    roleId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
          model: 'Roles',
          key: 'roleId'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    }
  }, {
    freezeTableName: true
  });
  userRole.associate = function(models) {
    // associations can be defined here
    userRole.belongsTo(models.users, {
      foreignKey : 'userId',
      targetKey: 'userId',
      as: 'Role'
    });
    userRole.belongsTo(models.Roles, {
      foreignKey : 'roleId',
      targetKey: 'roleId',
      as: 'RoleDetail'
    });
  };
  return userRole;
};