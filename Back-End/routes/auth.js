const passport = require('passport');
const passportJWT = require('passport-jwt');
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const app = express();
const {Agent} = require('../APIDB/sequelize')
const {Admin} = require('../APIDB/sequelize')
const crypto = require('crypto');
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

async function auth(req, res, next) {
    console.log(req.body);
    const { email, password } = req.body;
    if (email && password) {
      let user = await getUser({ email: email });
      console.log('my user is',user);
      if (!user) {
        res.status(401).json({ message: 'No such user found' });
      }
      if (user.password === password) {
        // from now on we'll identify the user by the id and the id is the 
        // only personalized value that goes into our token
        let payload = { id: user.id , project_id: user.projectId};
        let token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.json({ msg: 'ok', token: token ,user:user});
      } else {
        res.status(401).json({ message: 'Password is incorrect'});
      }
    }
  };

  const getUser = async obj => {
    const agent= await Agent.findOne({
      where: obj
    });
    if(agent){
      return agent;
    }else{
      return await Admin.findOne({
        where: obj
      });
    }
  };
  
  jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  jwtOptions.secretOrKey = 'my secret token';
  
  //lets create our strategy for web token
  let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  let user = getUser({ id: jwt_payload.id });
  if (user) {
    console.log('my userrr data with payload is',user);
    next(null, user);
  } else {
    next(null, false);
  }
  });
  //use the strategy
  passport.use(strategy);
  app.use(passport.initialize());

  
  function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
  
      req.token = bearerToken;
      jwt.verify(req.token, 'my secret token', function (err, data) {
        if (err) {
          res.sendStatus(403);
        } else {
          next();
        }
      })
    }
  
    else {
      res.sendStatus(400);
    }
  }

  function authenticate(req, res, next) {
    const user = { id: 73673930709 };
  
    const token = jwt.sign({ user: user.id }, 'my secret key'); {
      // if (typeof token !== 'undefined') {
      res.header("token", token);
      next();
    }
  }

  function ensureToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      jwt.verify(req.token, 'my secret key', function (err, data) {
        if (err) {
          res.sendStatus(403);
        } else {
          next();
        }
      })
    }
  
    else {
      res.sendStatus(400);
    }
  }
  // function decrypt(text) {
  //   let textParts = text.split(':');
  //   let iv = Buffer.from(textParts.shift(), 'hex');
  //   let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  //   let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  //   let decrypted = decipher.update(encryptedText);
   
  //   decrypted = Buffer.concat([decrypted, decipher.final()]);
   
  //   return decrypted.toString();
  //  }

  //  function encrypt(text) {
  //   let iv = crypto.randomBytes(IV_LENGTH);
  //   let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  //   let encrypted = cipher.update(text);
   
  //   encrypted = Buffer.concat([encrypted, cipher.final()]);
   
  //   return iv.toString('hex') + ':' + encrypted.toString('hex');
  //  }

  module.exports = {
      auth : auth, ensureToken : ensureToken, verifyToken: verifyToken, authenticate : authenticate
      // decrypt:decrypt, encrypt:encrypt
  }