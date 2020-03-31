var jwt = require('jsonwebtoken')
require('dotenv').config()
var secret = process.env.SECRET
var users = require('../../models').users
var path = require('path')
var multer  = require('multer')
// var AWS = require('aws-sdk');

// var accessKeyId =  process.env.AWS_ACCESS_KEY || "xxxxxx";
// var secretAccessKey = process.env.AWS_SECRET_KEY || "+xxxxxx+B+xxxxxxx";

// AWS.config.update({
//     accessKeyId: accessKeyId,
//     secretAccessKey: secretAccessKey
// });

// var s3 = new AWS.S3();


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './public/images')
  },
  filename: function (req, file, cb) {
      cb(null, path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({ storage: storage}).single('file');
var signUpImage = multer({ storage: storage}).fields([{name: 'logo'},{name:'successStories'}]);



module.exports = {
  authorization(req, res, next) {
    console.log('sssdddsdddddddddddddd',req.body)
    upload(req, res, function (err, result) {
      try {
      
      if (err) {
        console.log('error', err)
      } else {
        header_auth_token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null
        var token = req.body.token || req.query.token || req.params.token || req.headers['x-access-token'] || header_auth_token;
      if (token) {
        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                return res.status(401).send({ success: false, message: 'Failed to authenticate token.' });
            } else {
                req.decoded = decoded;
                return users.findOne({ where:{userId: req.decoded.id }})
                .then(result => {
                if(result)
                {  
                  next() 
                } else {
                  res.send({
                    status: false,
                    error: "User Not Exist"
                })
              } 
            })
          }
      });
    } else {
        return res.status(403).send({
            success: false,
            message: 'Not Authorized'
        });
    }

      }
    } catch(err) {
      console.log(err)
    }
    })
    
  },

  signUpAuth(req, res, next) {
    signUpImage(req, res, function (err, result) {
      if (err) {
        console.log('error', err)
      } else {
        next()
      }
    })
  }
}

