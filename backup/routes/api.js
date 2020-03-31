
const apiController = require('../controllers/apiController')
var passport = require('../controllers/middlewares/passport-jwt')


module.exports = (app) => {
  app.post('/api/signUp', apiController.signUp)
  app.post('/api/updateProfile', apiController.updateProfile)
  app.post('/api/post', passport.authorization, apiController.post)
  app.post('/api/getMyDonations', passport.authorization, apiController.getMyDonations)
  app.get('/api/getOrganisations', apiController.getOrganisations)
  app.get('/api/getCausesArea', apiController.getCausesArea)
  app.post('/api/login', apiController.login)
  app.post('/api/logOut', apiController.logOut)
  app.post('/api/forgetPassword', apiController.forgetPassword)
  app.get('/api/verifyAccount/:token', passport.authorization, apiController.verifyAccount);
}
