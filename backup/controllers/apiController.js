const Bcrypt = require("bcryptjs");

require('dotenv').config()
var secret = process.env.SECRET
const users = require('../models').users,
  organisations = require('../models').organisations;
  organisationCauses = require('../models').organisationCauses;
  Donations = require('../models').Donations;
  Admins = require('../models').Admins;
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
  signUp(req, res) {
    return users
      .create({
        fullName: req.body.fullName,
        email: req.body.email,
        password:req.body.password,
        organisationId: req.body.organisationId,
        address: req.body.address,
        einNumber: req.body.einNumber,
        zipcode: req.body.zipcode,
        city: req.body.city,
        state: req.body.state,
        phoneNumber: req.body.phoneNumber
      })
      .then(result => {
        const token = jwt.sign({ id: result.userId }, secret);
        let link = process.env.SITE_URL+'/api/verifyAccount/'+token;
        ejs.renderFile(__dirname + "/emailTemplate/verifyAccount.ejs", {link : link }, function (err, data) {
          if (err) {
            console.log(err)
              res.send({
                status: false,
                message: err
            })
          } else {
            ejs.renderFile(__dirname + "/emailTemplate/verifyAccount.ejs", { link : link  }, function (err, data) {
              var mainOptions = {
                  from: '"osvinphp@gmail.com" <foo@example.com>', // sender address
                  to: result.email, // list of receivers
                  subject: "Verify Activation", // Subject line
                  html: data
              }
              transporter.sendMail(mainOptions, function (err, info) {
                  if (err) {
                      res.send({
                        status: false,
                        message: err
                    })
                  } else {
                    res.send({
                      status: true,
                      message: 'Check your mail to Confirm your account',
                      data: result
                    })
                  transport.close()
                  }
              })
            })
          }
          })
      })
      .catch(err => {
        let error = err.errors ? err.errors[0].message : err
        console.log(error)
        res.send({
          status: false,
          message: error
        })
      })
  },

  post(req, res) {
    return Donations
      .create({
        userId: req.decoded.id,
        itemName: req.body.postName,
        itemImage: req.file.filename,
        itemDescription: req.body.postDescription,
        itemMethod: req.body.postMethod,
        mile: req.body.mile
      })
      .then( result =>{
          res.send({
            status: true,
            message: "Item Submitted Successfully"
        })
      })
      .catch(err => {
        let error = err.errors ? err.errors[0].message : err
        res.send({
          status: false,
          message: error
        })
      })
  },
  
  getMyDonations(req, res) {
    return Donations
            .findAll({where:[{userId: req.decoded.id }],
                order: [[
                    'createdAt',
                    'DESC'
                ]]
            })
            .then(result=>
                res.send({
                  status:true,
                  message:result
                })
            )
            .catch(err => {
                let error= err.errors ? err.errors[0].message : err
                res.send({
                  status: false,
                  message: error
                })
            })
  },
  
  verifyAccount(req, res) {
    return users
    .findOne({
      where: {
        userId: req.decoded.id
      }
    })
      .then( result => {
        if(result){
          if(result.emailVerified == null ){
            result.update({
              emailVerified: 1
            })
            .then( result1 => {
              res.send({
                status: true,
                error: false,
                message: "Account verified successfully."
            })
            })
          }else{
            res.send({
              status: true,
              error: false,
              message: "Your Account is already Verified."
          })
          }
          
        }else{
          res.send({
            status: false,
            message: "No User Exist"
          })
        }
      })
      .catch(err => {
        let error = err.errors ? err.errors[0].message : err
              res.send({
                status: false,
                message: error
              })
      })
  },

  updateProfile(req, res) {
      return users
            .findOne({
                where: {
                  userId: req.body.userId
                }
            })
            .then(result => {
                if(result){
                    result.update({
                      fullName: req.body.fullName,
                      organisationId: req.body.organisationId,
                      address: req.body.address,
                      einNumber: req.body.einNumber,
                      zipcode: req.body.zipcode,
                      city: req.body.city,
                      state: req.body.state,
                      status: req.body.status,
                      phoneNumber: req.body.phoneNumber
                    })
                        .then(result1 => {
                            res.send({status: true, result1: result1})
                        })
                        .catch(err => {
                            res.send({status: false, err:err});
                        });
                }
                else
                    res.send({
                      status: false,
                      message: "No such UserId"
                    })
            })
  },

  getOrganisations(req, res){
    return organisations
            .findAll({
                order: [[
                    'createdAt',
                    'DESC'
                ]]
            })
            .then(result=>
                res.send({
                  status:true,
                  message:result
                })
            )
            .catch(err => {
                let error= err.errors ? err.errors[0].message : err
                res.send({
                  status: false,
                  message: error
                })
            })
  },

  getCausesArea(req, res) {
    return causesArea
            .findAll({
                order: [[
                    'createdAt',
                    'DESC'
                ]]
            })
            .then(result=>
                res.send({
                  status:true,
                  message:result
                })
            )
            .catch(err => {
                let error= err.errors ? err.errors[0].message : err
                res.send({
                    status: false,
                    message: error
                })
            })
  },

  login(req, res) {
    return users
            .findOne({
                where:{
                    email: req.body.email
                }
            })
            .then(result => {
                if(result){
                    if(Bcrypt.compareSync(req.body.password, result.password)){
                      if(result.emailVerified === 1){
                        var tokenn = jwt.sign({ id: result.userId }, secret)
                        result.update({ token: tokenn }).then(result1 => {
                        res.send({
                          status: true,
                          message: "Successfully logged In",
                          token: tokenn
                      })
                      })
                      }else{
                        res.send({
                          status: false,
                          message: "Your Account is Not Verified"
                        })
                      }
                    }
                    else
                        res.send({
                          status: false,
                          message: "Password Does Not Match"
                        })
                }
                else
                    res.send({
                      status: false,
                      message: "No email exist"
                    })
            })
            .catch(err => {
              let error = err.errors ? err.errors[0].message : err
              res.send({
                status: false,
                message: error
              })
            })
  },

  forgetPassword(req, res) {
    return users
            .findOne({
                where: {
                  email: req.body.email
                }
            })
            .then(result => {
                if(result){
                  ejs.renderFile(__dirname + "/emailTemplate/email.ejs", {email : result.email, password: result.password }, function (err, data) {
                    if (err) {
                        res.send({
                          status: false,
                          message: err
                      })
                    } else {
                      ejs.renderFile(__dirname + "/emailTemplate/email.ejs", { email : result.email, password: result.password  }, function (err, data) {
                        var mainOptions = {
                            from: '"osvinphp@gmail.com" <foo@example.com>', // sender address
                            to: result.email, // list of receivers
                            subject: "Forget Password", // Subject line
                            html: data
                        };
                        transporter.sendMail(mainOptions, function (err, info) {
                            if (err) {
                                res.send({
                                  status: false,
                                  message: err
                              })
                            } else {
                              res.send({
                                status: true,
                                message: 'Message sent: ' + info.messageId
                            })
                            transport.close();
                            }
                        });
                      });
                    }
                    });
                }
                else
                    res.send({
                      status: false,
                      message: "No email Exist"
                    })
            })
  },

  logOut(req, res) {
    console.log(req.body.token)
    return users.findOne({where: {token: req.body.token}})
    .then(result => {
      if(result){
        result.update({token: null}).then(result1 => {
            res.send({
              status: true,
              message: "Successfully Logged Out"
          })
        })
      }else{
        res.send({
          status: false,
          message: "No User Found"
      })
      }
    })
    .catch(err => {
      let error = err.errors ? err.errors[0].message : err
      res.send({
        status: false,
        message: error
      })
    })
  },


}