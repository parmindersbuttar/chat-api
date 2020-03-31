const Bcrypt = require("bcryptjs");
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
require('dotenv').config()
var secret = process.env.SECRET
const users = require('../models').users,
  organisationType = require('../models').organisationTypes;
UserOrganisation = require('../models').UserOrganisations;
Donations = require('../models').Donations;
Donations = require('../models').Donations;
feedback = require('../models').feedbacks;
Role = require('../models').Roles;
Admins = require('../models').Admins;
causesArea = require('../models').causesAreas;
organisationRequitments = require('../models').organisationRequitments;
organsationSuccessStories = require('../models').organsationSuccessStories;
userCausesAreas = require('../models').userCausesAreas;
userRole = require('../models').userRoles;
DonatedItem = require('../models').DonatedItems;
Messages = require('../models').message;
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
  individualSignUp(req, res) {
    return users
      .create({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        zipcode: req.body.zipcode,
        city: req.body.city,
        state: req.body.state,
        phoneNumber: req.body.phoneNumber,
        userRole: {
          roleId: req.body.roleId
        },
      }, {
          include: [
            {
              model: userRole,
              as: 'Role'
            }]
        })
      .then(result => {
        const token = jwt.sign({ id: result.userId }, secret);
        let link = process.env.SITE_URL + '/api/verifyAccount/' + token;
        ejs.renderFile(__dirname + "/emailTemplate/verifyAccount.ejs", { link: link }, function (err, data) {
          if (err) {
            res.send({
              status: false,
              message: err
            })
          } else {
            ejs.renderFile(__dirname + "/emailTemplate/verifyAccount.ejs", { link: link }, function (err, data) {
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
        console.log(err, "error")
        let error = err.errors ? err.errors[0].message : err
        console.log(error, "error")
        res.send({
          status: false,
          message: error
        })
      })
  },

  organisationSignUp(req, res) {
    console.log("organisationSignUp:-", req.body)
    console.log("organisationSignUp Files: ", req.files)
    var logo = null,
      successStories = null
    if (req.files) {
      var logo = req.files.logo[0].filename,
        successStories = req.files.successStories[0].filename
    }
    return users
      .create({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        zipcode: req.body.zipcode,
        city: req.body.city,
        state: req.body.state,
        phoneNumber: req.body.phoneNumber,
        UserOrg: {
          organisationTypeId: req.body.organisationTypeId,
          organisationName: req.body.organisationName,
          website: req.body.website,
          einNumber: req.body.einNumber,
          logo: logo,
          missionStatement: req.body.missionStatement,
          organisationDescription: req.body.organisationDescription,
          UserOrganisationDetails: {
            causeAreaId: req.body.causeAreaId
          },
          SuccessStories: {
            successStory: successStories
          }
        },
        userRole: {
          roleId: req.body.roleId
        }
      }, {
          include: [
            {
              model: UserOrganisation,
              as: 'UserOrg',
              attributes: ['organisationTypeId', 'organisationName', 'website', 'profilePicture', 'missionStatement', 'organisationDescription', 'logo'],
              include: [
                {
                  model: userCausesAreas,
                  as: 'UserOrganisationDetails',
                },
                {
                  model: organsationSuccessStories,
                  as: 'SuccessStories',
                }]
            },
            {
              model: userRole,
              as: 'Role'
            }
          ]
        })
      .then(result => {
        const token = jwt.sign({ id: result.userId }, secret);
        let link = process.env.SITE_URL + '/api/verifyAccount/' + token;
        ejs.renderFile(__dirname + "/emailTemplate/verifyAccount.ejs", { link: link }, function (err, data) {
          if (err) {
            console.log(err)
            res.send({
              status: false,
              message: err
            })
          } else {
            ejs.renderFile(__dirname + "/emailTemplate/verifyAccount.ejs", { link: link }, function (err, data) {
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

  addDonation(req, res) {
    console.log('dfhdbsfbsdfsbdfbbsjfsjfbjh' + req.file.filename)
    return Donations
      .create({
        userId: req.decoded.id,
        itemName: req.body.postName,
        itemImage: req.file.filename,
        itemDescription: req.body.postDescription,
        itemMethod: req.body.postMethod,
        mile: req.body.mile
      })
      .then(result => {
        console.log(result)
        res.send({
          status: true,
          message: "Item Submitted Successfully"
        })
      })
      .catch(err => {
        console.log(err)
        let error = err.errors ? err.errors[0].message : err
        res.send({
          status: false,
          message: error
        })
      })
  },

  getMyDonations(req, res) {
    return Donations
      .findAll({
        where: [{ userId: req.decoded.id }],
        order: [[
          'createdAt',
          'DESC'
        ]]
      })
      .then(result =>
        res.send({
          status: true,
          message: result
        })
      )
      .catch(err => {
        let error = err.errors ? err.errors[0].message : err
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
      .then(result => {
        if (result) {
          if (result.emailVerified == null) {
            result.update({
              emailVerified: 1
            })
              .then(result1 => {
                // res.send({
                //   status: true,
                //   error: false,
                //   message: "Account verified successfully."
                // })
                res.render('verifiedEmail')
              })
          } else {
            res.send({
              status: true,
              error: false,
              message: "Your Account is already Verified."
            })
          }

        } else {
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

  individualProfile(req, res) {
    return users
      .findOne({
        where: [{ userId: req.decoded.id }],
        attributes: ['fullName', 'address', 'zipcode', 'city', 'profilePicture', 'state', 'phoneNumber', 'createdAt',
        ],
        include: [{
          model: DonatedItem,
          as: 'ItemsDonated',
          required: true,
          attributes: ['userId'],
        }],
        // group: ['userId'],
      })
      .then(result =>
        res.send({
          status: true,
          message: result
        })
      )
      .catch(err => {
        let error = err.errors ? err.errors[0].message : err
        res.send({
          status: false,
          message: error
        })
      })
  },

  updateIndividualProfile(req, res) {

    return users
      .findOne({
        where: {
          userId: req.decoded.id
        }
      })
      .then(result => {
        if (result) {
          if (req.file) {
            var profilePicture = req.file.filename
          } else {
            profilePicture = result.profilePicture
          }
          result.update({
            fullName: req.body.fullName,
            address: req.body.address,
            zipcode: req.body.zipcode,
            profilePicture: profilePicture,
            city: req.body.city,
            state: req.body.state,
            phoneNumber: req.body.phoneNumber
          })
            .then(result1 => {
              res.send({ status: true, result1: result1 })
            })
            .catch(err => {
              res.send({ status: false, err: err });
            });
        }
        else
          res.send({
            status: false,
            message: "No such UserId"
          })
      })
  },

  organisationProfile(req, res) {
    return users
      .findOne({
        where: [{ userId: req.decoded.id }],
        attributes: ['fullName', 'address', 'zipcode', 'city', 'profilePicture', 'state', 'phoneNumber', 'createdAt',
        ],
        include: [
          {
            model: UserOrganisation,
            as: 'UserOrg',
            attributes: ['organisationName', 'website', 'logo', 'missionStatement', 'organisationDescription']
          },
          {
            model: organisationRequitments,
            as: 'orgRequitments',
            required: false,
            attributes: ['itemTitle', 'itemDescription', 'createdAt']
          },
          {
            model: DonatedItem,
            as: 'ItemsDonated',
            required: false,
            attributes: ['userId'],
          },
        ],
        // group: ['userId'],
      })
      .then(result =>
        res.send({
          status: true,
          message: result
        })
      )
      .catch(err => {
        let error = err.errors ? err.errors[0].message : err
        res.send({
          status: false,
          message: error
        })
      })
  },

  updateOrganisationProfile(req, res) {
    return users
      .findOne({
        where: {
          userId: req.decoded.id
        },
        attributes: ['userId', 'fullName', 'address', 'zipcode', 'city', 'state', 'phoneNumber'],
        include: {
          model: UserOrganisation,
          as: 'UserOrg',
          attributes: ['organisationName', 'website', 'logo', 'missionStatement', 'organisationDescription']
        }
      })
      .then(result => {
        if (result) {
          result.update({
            fullName: req.body.fullName,
            address: req.body.address,
            zipcode: req.body.zipcode,
            city: req.body.city,
            state: req.body.state,
            phoneNumber: req.body.phoneNumber,
          }).then(result1 => {
            if (req.file) {
              var logo = req.file.filename
            } else {
              logo = result.UserOrg[0].logo
            }
            UserOrganisation.update({
              organisationName: req.body.organisationName,
              website: req.body.website,
              missionStatement: req.body.missionStatement,
              organisationDescription: req.body.organisationDescription,
              logo: logo
            }, {
                where: {
                  userId: result.userId
                }
              }).then(result2 => {
                res.send({ status: true, message: result2 })
              })
              .catch(err => {
                res.send({ status: false, err: err });
              });
          })
            .catch(err => {
              res.send({ status: false, err: err });
            });
        }
        else
          res.send({
            status: false,
            message: "No such UserId"
          })
      })
  },

  getOrganisationtypes(req, res) {
    return organisationType
      .findAll({
        order: [[
          'createdAt',
          'DESC'
        ]]
      })
      .then(result =>
        res.send({
          status: true,
          message: result
        })
      )
      .catch(err => {
        let error = err.errors ? err.errors[0].message : err
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
      .then(result =>
        res.send({
          status: true,
          message: result
        })
      )
      .catch(err => {
        let error = err.errors ? err.errors[0].message : err
        res.send({
          status: false,
          message: error
        })
      })
  },

  login(req, res) {
    return users
      .findOne({
        where: {
          email: req.body.email
        }
      })
      .then(result => {
        if (result) {
          if (Bcrypt.compareSync(req.body.password, result.password)) {
            if (result.emailVerified === 1) {
              var tokenn = jwt.sign({ id: result.userId }, secret)
              result.update({ token: tokenn }).then(result1 => {
                userRole.findOne({ where: { userId: result1.userId } }).then(resultRole => {
                  Role.findOne({ where: { roleId: resultRole.roleId } }).then(resultRole1 => {
                    res.send({
                      status: true,
                      message: "Successfully logged In",
                      token: tokenn,
                      role: resultRole1.roleName,
                      userId: result.userId 
                    })
                  })
                })
              })
            } else {
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
        if (result) {
          ejs.renderFile(__dirname + "/emailTemplate/email.ejs", { email: result.email, password: result.password }, function (err, data) {
            if (err) {
              res.send({
                status: false,
                message: err
              })
            } else {
              ejs.renderFile(__dirname + "/emailTemplate/email.ejs", { email: result.email, password: result.password }, function (err, data) {
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
    return users.findOne({ where: { userId: req.decoded.id } })
      .then(result => {
        if (result) {
          result.update({ token: null }).then(result1 => {
            res.send({
              status: true,
              message: "Successfully Logged Out"
            })
          })
        } else {
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

  getDonatedItems(req, res) {
    return DonatedItem
      .findAll({
        where: [{ userId: req.decoded.id }],
        attributes: ['donatedIemid', 'organisationId', 'userId', 'itemId', 'createdAt'],
        order: [[
          'createdAt',
          'DESC'
        ]],
        include: [
          //   {
          //   model: users,
          //   as: 'userdetail'
          // },
          // {
          //   model: organisations,
          //   as: 'organisationdetail'
          // },
          {
            model: Donations,
            as: 'donationDetail',
            attributes: ['itemName', 'itemDescription', 'itemImage', 'itemMethod', 'mile']
          }]
      })
      .then(result =>
        res.send({
          status: true,
          message: result
        })
      )
      .catch(err => {
        let error = err.errors ? err.errors[0].message : err
        res.send({
          status: false,
          message: error
        })
      })
  },

  feedback(req, res) {
    return feedback
      .create({
        userId: req.decoded.id,
        feedback: req.body.feedback
      })
      .then(result => {
        res.send({
          status: true,
          message: "Feedback Submitted Successfully"
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


  addMyRequirement(req, res) {
    return organisationRequitments
      .create({
        userId: req.decoded.id,
        itemTitle: req.body.itemTitle,
        itemDescription: req.body.itemDescription
      })
      .then(result => {
        users.findOne({
          where: [{ userId: result.userId }],
          attributes: ['fullName', 'email'],
          include: [
            {
              model: UserOrganisation,
              as: 'UserOrg',
              required: true,
              attributes: ['organisationName'],
            }
          ]
        }).then(userdetails => {
          res.send({
            status: true,
            message: "Requiment Added Successfully",
            data: result,
            OrganisationDetail: userdetails
          })
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

  getMyRequirement(req, res) {
    return organisationRequitments
      .findAll({
        where: [{ userId: req.decoded.id }],
        order: [[
          'createdAt',
          'DESC'
        ]],
      })
      .then(result =>
        res.send({
          status: true,
          message: result
        })
      )
      .catch(err => {
        let error = err.errors ? err.errors[0].message : err
        res.send({
          status: false,
          message: error
        })
      })
  },

  DonateItem(req, res) {
    console.log("DonateItem... -> ", req.body);
    return DonatedItem
      .create({
        userId: req.decoded.id,
        organisationId: req.body.organisationId,
        itemId: req.body.itemId,
        message: req.body.message
      })
      .then(result => {
        let conversationId = result.userId>result.organisationId ? result.organisationId+"_"+result.userId : result.userId+"_"+result.organisationId
        Messages
        .create({
          senderId: result.userId,
          receiverId: result.organisationId,
          message: result.message,
          conversationId:conversationId
        })
        .then(resultt => {
          users.findOne({
            where: [{ userId: resultt.senderId }],
            attributes: ['fullName', 'email'],
            include: [
              {
                model: UserOrganisation,
                as: 'UserOrg',
                required: true,
                attributes: ['organisationName']
              }
            ]
          }).then(userdetails => {
            res.send({
              status: true,
              message: "Item Donated Successfully",
              data: resultt,
              OrganisationDetail: userdetails
            })
          })
        })
        .catch(errr => {
          let error = err.errors ? err.errors[0].message : err
          res.send({
            status: false,
            message: error
          })
        })
        
      })
      .catch(err => {
        console.log(err, "err")
        let error = err.errors ? err.errors[0].message : err
        res.send({
          status: false,
          message: error
        })
      })
  },

  updateMyRequirement(req, res) {
    return organisationRequitments
      .findOne({
        where: {
          organisationRequitmentId: req.body.organisationRequitmentId
        }
      })
      .then(result => {
        if (result) {
          result.update({
            itemTitle: req.body.itemTitle,
            itemDescription: req.body.itemDescription,
          })
            .then(result1 => {
              res.send({ status: true, result1: result1 })
            })
            .catch(err => {
              res.send({ status: false, err: err });
            });
        }
        else
          res.send({
            status: false,
            message: "No such requirment"
          })
      })
  },

  requirementById(req, res) {
    return organisationRequitments
      .findOne({
        where: [{ organisationRequitmentId: req.body.organisationRequitmentId }],
        order: [[
          'createdAt',
          'DESC'
        ]],
      })
      .then(result =>
        res.send({
          status: true,
          message: result
        })
      )
      .catch(err => {
        let error = err.errors ? err.errors[0].message : err
        res.send({
          status: false,
          message: error
        })
      })
  },

  allRequirement(req, res) {
    var offset = 10 * (req.params.pageNo - 1)
    return organisationRequitments
      .findAll({
        //  include: [{
        //   model: 	users,
        //   include:[{
        //     model: UserOrganisation,
        //     as: 'UserOrg',
        //     // required: true,
        //     attributes: ['logo'] 
        //   }]
        // }],
        where: [{ itemTitle: { [Op.like]: '%' + req.body.itemTitle + '%' } }],
       
        order: [[
          'createdAt',
          'DESC'
        ]],
        offset: offset,
        limit: 10
      })
      .then(result => {
        // UserOrganisation.findOne
          console.log("Organistaion Result", result);
          res.send({
            status: true,
            message: result
          })
        }
      )
      .catch(err => {
        let error = err.errors ? err.errors[0].message : err
        res.send({
          status: false,
          message: error
        })
      })
  },

  requirementOrganisationDetail(req, res) {
    return UserOrganisation
      .findOne({
        where: [{ userId: req.body.userId }],
      })
      .then(result =>
        res.send({
          status: true,
          message: result
        })
      )
      .catch(err => {
        let error = err.errors ? err.errors[0].message : err
        res.send({
          status: false,
          message: error
        })
      })
  },

  getDonationsRequest(req, res) {
    console.log("getDonationsReq: ", req.body);
    var offset = 10 * (req.params.pageNo - 1)
    return DonatedItem
      .findAll({
        where: [{
          organisationId: req.decoded.id
        }],
        attributes: ['userId', 'itemId', 'message', 'createdAt'],
        order: [[
          'createdAt',
          'DESC'
        ]],
        offset: offset,
        limit: 10,
        include: [{
          model: Donations,
          as: 'donationDetail',
          attributes: ['itemName', 'itemDescription', 'itemImage', 'itemMethod', 'mile',],
          where: [{ itemName: { [Op.like]: '%' + req.body.itemName + '%' } }],
        }]
      })
      .then(result =>
        res.send({
          status: true,
          message: result
        })
      )
      .catch(err => {
        let error = err.errors ? err.errors[0].message : err
        res.send({
          status: false,
          message: error
        })
      })
  },
  receiveIndividualRequest(req, res) {
    let conversationId = req.decoded.id>req.body.receiverId ? req.body.receiverId+"_"+req.decoded.id : req.decoded.id+"_"+req.body.receiverId
    console.log(conversationId,"conversationId",req.body, "Req")
    return Messages
      .create({
        receiverId: req.body.receiverId,
        senderId: req.decoded.id,
        message: req.body.message,
        conversationId: conversationId
      })
      .then(result => {
        res.send({
          status: true,
          message: "Donation Accepted Successfully",
          data: result
        })
      })
      .catch(err => {
        console.log(err, "err")
        let error = err.errors ? err.errors[0].message : err
        res.send({
          status: false,
          message: error
        })
      })
  },
  // messageUserList(req, res) {
  //   return Messages
  //     .findAll({
  //       where: [{
  //         [Op.or]: [{[Op.and]: [{senderId: {[Op.eq]: sender}}, 
  //             {receiverId: {[Op.eq]: receiver}}]}, 
  //             {[Op.and]: [{senderId: {[Op.eq]: sender}}, 
  //             {receiverId: {[Op.eq]: receiver}}]}
  //         ]
  //       }],
  //       attributes: ['receiverId', 'message', 'isred', 'createdAt'],
  //       order: [[
  //         'createdAt',
  //         'DESC'
  //       ]],
  //       include:[{
  //         user
  //       }]
  //     })
  //     .then(result => {
  //       res.send({
  //         status: true,
  //         message: "Donation Accepted Successfully",
  //         data: result
  //       })
  //     })
  //     .catch(err => {
  //       console.log(err, "err")
  //       let error = err.errors ? err.errors[0].message : err
  //       res.send({
  //         status: false,
  //         message: error
  //       })
  //     })
  // },

  chatHistory(req, res) {
    let user = req.body;
    return Messages
      .findAll({
        where: [{
          [Op.and]: [{conversationId: {[Op.eq]: user.conversationId}}]
        }],
        attributes: ['senderId', 'message', 'isred', 'createdAt', 'conversationId'],
        order: [[
          'createdAt',
          'ASC'
        ]],
        // include:[{
        //   user
        // }]
      })
      .then(result => {
        res.send({
          status: true,
          message: "Donation Accepted Successfully",
          data: result
        })
      })
      .catch(err => {
        console.log(err, "err")
        let error = err.errors ? err.errors[0].message : err
        res.send({
          status: false,
          message: error
        })
      })
  },


  DonationsRequestDetail(req, res) {
    return Donations
      .findOne({
        where: [{
          itemId: req.body.itemId
        }],
        attributes: ['itemName', 'itemDescription', 'itemImage', 'itemMethod', 'mile','userId'],
        order: [[
          'createdAt',
          'DESC'
        ]],
      })
      .then(result =>
        res.send({
          status: true,
          message: result
        })
      )
      .catch(err => {
        let error = err.errors ? err.errors[0].message : err
        res.send({
          status: false,
          message: error
        })
      })
  },



}