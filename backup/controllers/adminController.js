const Bcrypt = require("bcryptjs");

require('dotenv').config()
var secret = process.env.SECRET
const users = require('../models').users,
  organisations = require('../models').organisations;
  organisationCauses = require('../models').organisationCauses;
  Admins = require('../models').Admins;
  Donations = require('../models').Donations;
  causesArea = require('../models').causesAreas;
  const nodemailer = require("nodemailer");
  var jwt = require('jsonwebtoken');
  var ejs = require("ejs");
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.Email_Password // generated ethereal password
    }
  });

module.exports = {
  login(req, res) {
    console.log(req.body)
    return Admins
    .findOne({
      where:{
        email: req.body.email
      }
    })
    .then( result => {
      if(result){
        console.log(result)
        if(result && Bcrypt.compareSync(req.body.password, result.password)) {
          res.redirect('dashboard',{message: 'Success'})
        } else {
          res.render('login',{message: 'Password is Incorrect'})
        }
      }else{
        res.render('login',{message: 'Incorrect Email'})
      }
    })
    .catch(err => {
      let error = err.errors ? err.errors[0].message : err
      // res.render('login',{message: 'Success',error: error})
      res.send({
        status: false,
        message: error
      })
    })
  },
}