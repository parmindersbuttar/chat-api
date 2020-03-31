'use strict';
const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('users', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    fullName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    address: DataTypes.STRING,
    profilePicture: DataTypes.STRING,
    password: DataTypes.STRING,
    zipcode: DataTypes.INTEGER,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    state: DataTypes.STRING,
    emailVerified: DataTypes.INTEGER,
    token: DataTypes.STRING,
    
  }, {
    freezeTableName: true
  });
  user.associate = function(models) {
    // associations can be defined here
    // user.hasMany(models.organisationCauses, {
    //   foreignKey : 'userId',
    //   targetKey: 'userId',
    //   as: 'causesAreaUser'
    // });
    user.hasMany(models.Donations, {
      foreignKey : 'userId',
      targetKey: 'userId',
      as: 'user_donation'
    });
    user.hasMany(models.message);
    user.hasMany(models.DonatedItems, {
      foreignKey : 'userId',
      targetKey: 'userId',
      as: 'ItemsDonated'
    });
    user.hasMany(models.UserOrganisations, {
      foreignKey : 'userId',
      targetKey: 'userId',
      as: 'UserOrg'
    });
    user.hasMany(models.organisationRequitments, {
      foreignKey : 'userId',
      targetKey: 'userId',
      as: 'orgRequitments'
    });
    user.hasMany(models.userRoles, {
      foreignKey : 'userId',
      targetKey: 'userId',
      as: 'Role'
    });
    user.hasMany(models.feedbacks, {
      foreignKey : 'userId',
      targetKey: 'userId',
      as: 'feedbk'
    });
    
  };
  user.beforeCreate((user, options) => {
    return bcrypt.hash(user.password, 10)
        .then(hash => {
          user.password = hash;
        })
        .catch(err => {
            throw new Error(); 
        });
  });
  // user.beforeUpdate((user, options) => {
  //   return bcrypt.hash(user.password, 10)
  //         .then(hash => {
  //           user.password = hash;
  //         })
  //         .catch(err => { 
  //             throw new Error(); 
  //         });
  // });
  // user.beforeCreate((user, options) => {
  //   return bcrypt.hash(user.einNumber, 10)
  //       .then(hash => {
  //         user.einNumber = hash;
  //       })
  //       .catch(err => {
  //           throw new Error(); 
  //       });
  // });
  // user.beforeUpdate((user, options) => {
  //   return bcrypt.hash(user.einNumber, 10)
  //         .then(hash => {
  //           user.einNumber = hash;
  //         })
  //         .catch(err => { 
  //             throw new Error(); 
  //         });
  // });
  return user;
};