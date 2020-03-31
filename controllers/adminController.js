const Bcrypt = require("bcryptjs");
var Sequelize = require('sequelize');
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
const nodemailer = require("nodemailer");
var jwt = require('jsonwebtoken');
var ejs = require("ejs");
var moment = require('moment');
const Op = Sequelize.Op;
var image = process.env.IMAGE_URL
let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // generated ethereal user
    pass: process.env.Email_Password // generated ethereal password
  }
});
var path = require('path')
var multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null, path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({ storage: storage }).single('file');


module.exports = {
  login(req, res) {
    return users
      .findOne({
        where: {
          email: req.body.email
        },
        include: [{
          model: userRole,
          as: 'Role',
          required: true,
          include: [{
            model: Role,
            as: 'RoleDetail',
            required: true,
            where: [{
              roleName: 'admin'
            }]
          }]
        }]
      })
      .then(result => {
        if (result) {
          if (result && Bcrypt.compareSync(req.body.password, result.password)) {
            req.session.data = result;
            req.session.success = true;
            res.redirect('dashboard')
          } else {
            res.render('login', { message: 'Password is Incorrect' })
          }
        } else {
          res.render('login', { message: 'Incorrect Email' })
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

  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return console.log(err);
      }
      res.redirect('/admin');
    });
  },

  forgetPassword(req, res) {
    return Admins
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
                    res.render('login', { message: err })
                  } else {
                    res.render('forgetPassword', { message: 'Message sent: ' + info.messageId })
                    transport.close()
                  }
                });
              });
            }
          });
        }
        else
          res.render('login', { message: "No email Exist" })
      })
  },


  listOrganisation(req, res) {


    return users
      .findAll({
        include: [
          {
            model: UserOrganisation,
            as: 'UserOrg',
            raw: true
          },
          {
            model: userRole,
            as: 'Role',
            required: true,
            include: {
              model: Role,
              as: 'RoleDetail',
              required: true,
              where: { roleName: 'organisation' }
            }
          },
        ],
        raw: true
      })
      .then(result => {
        organisationRequitments.count({
          group: ['userId'],
          raw: true
        }).then(response => {
          var result1;
          result1 = { result: result, response: response, }
          res.render('listOrganisation', {
            result1
          })
        })
      })
      .catch(err => {
        console.log(err)
        let error = err.errors ? err.errors[0].message : err
        res.render('listOrganisation', { message: error })
      })
  },



  listIndividual(req, res) {
    return users
      .findAll({
        include: [
          {
            model: userRole,
            as: 'Role',
            required: true,
            include: {
              model: Role,
              as: 'RoleDetail',
              required: true,
              where: {
                roleName: 'individual'
              }
            }
          }
        ]
      })
      .then(result => {
        DonatedItem.count({
          group: ['userId'],
          raw: true
        }).then(response => {
          var result1;
          result1 = { result: result, response: response, }
          res.render('listIndividual', { result1, message: '' })
        })
      })
      .catch(err => {
        let error = err.errors ? err.errors[0].message : err
        res.render('listIndividual', { message: error })
      })
  },



  listCauseArea(req, res) {
    causesArea.findAll({
      order: [[
        'createdAt',
        'DESC'
      ]]
    }).then(result => {
      res.render('listCauseArea', { result: result, image: image })
    }).catch(err => {
      let error = err.error ? err.error[0].message : error
      res.render('listCauseArea', { error: error })
    })
  },
  listCauseDelete(req, res) {
    return causesArea.destroy({
      where: { causeAreaId: req.body.Id }
    }
    ).then(result1 => {
      causesArea.findAll({
        order: [[
          'createdAt',
          'DESC'
        ]]
      }).then(result => {
        res.render('listCauseArea', { result: result })
      }).catch(err => {
        let error = err.error ? err.error[0].message : error
        res.render('listCauseArea', { error: error })
      })
    }).catch(err => {
      let error = err.error ? err.error[0].message : error
      res.render('listCauseArea', { error: error })
    })
  },

  listCauseEdit(req, res) {
    causesArea.findOne({
      where: [{ causeAreaId: req.params.id }],
      attributes: ['causeAreaId', 'causeAreaName', 'causeAreaImage', 'causeAreaDescription'],
      order: [[
        'createdAt',
        'DESC'
      ]]
    }).then(result => {
      res.render('listCauseEdit', { result: result })
    }).catch(err => {
      let error = err.error ? err.error[0].message : error
      res.render('listCauseEdit', { error: error })
    })
  },

  listType(req, res) {
    organisationType.findAll({
      order: [[
        'createdAt',
        'DESC'
      ]]
    }).then(result => {
      res.render('listType', { result: result })
    }).catch(err => {
      let error = err.error ? err.error[0].message : error
      res.render('listType', { error: error })
    })
  },

  listTypeByID(req, res) {
    organisationType.findOne({
      where: [{ organisationTypeId: req.params.id }],
      attributes: ['organisationTypeId', 'organisationTypeName', 'organisationTypeDescription'],
      order: [[
        'createdAt',
        'DESC'
      ]]
    }).then(result => {
      res.render('listTypeEdit', { result: result })
    }).catch(err => {
      let error = err.error ? err.error[0].message : error
      res.render('listTypeEdit', { error: error })
    })
  },

  listTypeUpdate(req, res) {
    organisationType.update({
      organisationTypeName: req.body.organisationTypeName,
      organisationTypeDescription: req.body.organisationTypeDescription,

    }, { where: { organisationTypeId: req.body.organisationTypeId } }).then(result1 => {
      organisationType.findAll({
        order: [[
          'createdAt',
          'DESC'
        ]]
      }).then(result => {
        res.render('listType', { result: result })
      }).catch(err => {
        let error = err.error ? err.error[0].message : error
        res.render('listType', { error: error })
      })
    }).catch(err => {
      let error = err.error ? err.error[0].message : error
      res.render('listTypeEdit', { error: error })
    })
  },

  listTypeByDelete(req, res) {
    return organisationType.destroy({
      where: { organisationTypeId: req.body.Id }
    }
    ).then(result1 => {
      organisationType.findAll({
        order: [[
          'createdAt',
          'DESC'
        ]]
      }).then(result => {
        res.render('listType', { result: result })
      }).catch(err => {
        let error = err.error ? err.error[0].message : error
        res.render('listType', { error: error })
      })
    }).catch(err => {
      let error = err.error ? err.error[0].message : error
      res.render('listType', { error: error })
    })
  },

  addType(req, res) {
    return organisationType.create(req.body).then(result => {
      res.redirect('listType')
    }).catch(err => {
      let error = err.errors ? err.errors[0].message : err
      res.render('addType', { error: error })
    })
  },


  addCauseArea(req, res) {
    upload(req, res, function (err, result) {
      if (err) {
        console.log('error', err)
      }
      return causesArea.create({
        causeAreaName: req.body.causeAreaName,
        causeAreaImage: req.file.filename,
        causeAreaDescription: req.body.causeAreaDescription
      }).then(result => {
        res.redirect('listCauseArea')
      }).catch(err => {
        let error = err.errors ? err.errors[0].message : err
        res.render('addType', { error: error })
      })
    })
  },
  async dashboard(req, res) {
    var donation, donationMonth;
    var orgData;
    await Donations.count({
      group: ['itemId'],
      raw: true
    }).then(userMonthActivityDetail1 => {
      donation = userMonthActivityDetail1.length;
    })
    await organisationRequitments.count({
      group: ['organisationRequitmentId'],
      raw: true
    }).then(userMonthActivityDetail2 => {
      orgData = userMonthActivityDetail2.length;
    })
    await Donations.count({ where: { [Op.and]: [Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('createdAt')), new Date().getFullYear()), Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('createdAt')), new Date().getMonth())] } }).then(userMonthActivityDetail => {
      donationMonth = userMonthActivityDetail;
    })
    await organisationRequitments.count({ where: { [Op.and]: [Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('createdAt')), new Date().getFullYear()), Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('createdAt')), new Date().getMonth())] } }).then(userMonthActivityDetail => {
      orgReqMonth = userMonthActivityDetail;
    })
    let resultDashboard= {
      donation: donation,
      orgData: orgData,
      donationMonth: donationMonth,
      orgReqMonth: orgReqMonth
    }
    res.render('dashboard', {resultDashboard: resultDashboard, message:''})
  },
  donationDelete(req, res){
    return Donations.destroy({
        where: {
          createdAt: {
            [Op.lt]: Sequelize.fn('DATE_SUB', Sequelize.literal('NOW()'),Sequelize.literal('INTERVAL 6 month'))
          }
        }
    }).then(result => {
      res.render('dashboard',{resultDashboard: result, message:'Donation has Deleted'})
    }).catch(err => {
      console.log(err,"err")
      let errDonation = err.errors ? err.errors[0].message : err
      res.render('dashboard', { errDonation: errDonation })
    })
  },
  listCauseUpdate(req, res) {
    upload(req, res, function (err, result) {
      if (err) {
        console.log('error', err)
      }
      var submittedData = {
        causeAreaName: req.body.causeAreaName,
        causeAreaDescription: req.body.causeAreaDescription,
        causeAreaImage: req.file && req.file.filename
      }
      if (!req.file)
        delete submittedData.causeAreaImage;
      causesArea.update(submittedData, { where: { causeAreaId: req.body.causeAreaId } }).then(result1 => {
        res.redirect('listCauseArea')
      }).catch(err => {
        let error = err.error ? err.error[0].message : error
        res.render('listCauseEdit', { error: error })
      })
    })
  },
  feedback(req, res) {
    return feedback.findAll({
      include: [{
        model: users,
        as: 'feedbk',
        required: true
      }]
    }).then(result => {
      // console.log(result[0].feedbk.fullName)
      res.render('feedback',
        {
          result: result,
          message: ''
        })
    }).catch(err => {
      let error = err.errors ? err.errors[0].message : err
      res.render('feedback', { error: error })
    })
  }



}