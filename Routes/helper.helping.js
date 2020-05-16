const config = require('../config/environment.config')
const jwt = require('jsonwebtoken')
const formidable = require('formidable')
// sign jwt token
let newConfig = {
    jwtOptions: {
      'secretOrKey': config.jwtOptions.secretOrKey || process.env.secretOrKey,
      'ignoreExpiration': config.jwtOptions.ignoreExpiration || process.env.ignoreExpiration
    }
  }
const signLoginData = (userInfo) => {
    return new Promise((resolve, reject) => {
      var token = jwt.sign(userInfo, newConfig.jwtOptions.secretOrKey, { expiresIn: 180000000 })
      return resolve(token)
    })
  }

  module.exports.signLoginData = signLoginData