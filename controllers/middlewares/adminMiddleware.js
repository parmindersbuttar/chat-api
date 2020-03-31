
module.exports =  {
  auth(req, res, next) {
    if (req.session.data) {
        next()    
    } else {
      res.redirect('/admin')
    }
  }
}

