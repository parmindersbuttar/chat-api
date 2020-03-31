const adminController = require('../controllers/adminController')
var passport = require('../controllers/middlewares/passport-jwt')

module.exports = (app) => {
  app.get('/' ,   function(req, res, next) {
    res.render('login', { 
        message: ''
     })
  })

  app.get('/forgetpassword' ,   function(req, res, next) {
    res.render('forgetPassword', { 
      message: ''
   })
  })
  app.get('/dashboard' ,   function(req, res, next) {
    res.render('dashboard', { 
      message: 'Successfully Logged In'
   })
  })

  app.post('/login',adminController.login)

}