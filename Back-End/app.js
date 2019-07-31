const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const passport = require('passport');
const passportJWT = require('passport-jwt');
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};
const { Agent } = require('./APIDB/sequelize.js')
const { Admin } = require('./APIDB/sequelize.js')
const credentials = require('./Cred')
const authentication = require('./routes/auth')
const intentCreate = require('./routes/Intent/createIntent.js')
const intentDelete = require('./routes/Intent/deleteIntent.js')
const entityTypeCreate = require('./routes/Entity/createEntityType.js')
const entityCreate = require('./routes/Entity/createEntity.js')
const intentDetect = require('./routes/Intent/detectIntent.js')
const intentTextDetect = require('./routes/Intent/detectTextIntent.js')
const intentList = require('./routes/Intent/listIntent.js')
const createKB = require('./routes/KnowledgeBase/createKB.js')
const deleteKB = require('./routes/KnowledgeBase/deleteKB.js')
const getKB = require('./routes/KnowledgeBase/getKB.js')
const getAgent = require('./routes/Agent/getAgent.js')
const trainAgent = require('./routes/Agent/trainAgent.js')
const jwt_Decode = require('jwt-decode');


//var mytoken = {}
router.use(bodyParser());
router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Expose-Headers", "token");
  next();
})
var corsOptionsDelegate = function (req, callback) {
  var corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  callback(null, corsOptions); // callback expects two parameters: error and options
}

router.options('*', cors(corsOptionsDelegate))
router.post('/login',authentication.decrypt, authentication.auth);
router.post('/createIntent',authentication.verifyToken, credentials.userData, intentCreate.createIntent); //Write like this one to add functionalities
router.delete('/deleteIntent',  authentication.verifyToken, credentials.userData, intentDelete.deleteIntent);
router.post('/createEntityType',  authentication.verifyToken, credentials.userData, entityTypeCreate.createEntityType);
router.post('/createEntity',  authentication.verifyToken, credentials.userData, entityCreate.createEntity);
router.get('/detectIntent',  authentication.ensureToken, credentials.userData, intentDetect.detectIntent);
router.get('/detectTextIntent', intentTextDetect.detectTextIntent);
router.get('/listIntent',  authentication.verifyToken, credentials.userData,intentList.listIntents);
router.post('/createKB',  authentication.verifyToken, credentials.userData,createKB.createKnowledgeBase);
router.delete('/deleteKB',  authentication.verifyToken, credentials.userData,deleteKB.deleteKnowledgeBase);
router.get('/getKB',  authentication.verifyToken, credentials.userData,getKB.getKnowledgeBase);
router.get('/getAgent',  authentication.verifyToken, credentials.userData,getAgent.getAgent);
router.post('/trainAgent',  authentication.verifyToken, credentials.userData, trainAgent.trainAgent);
router.post('/firstMessage',  authentication.authenticate, function (req, res) {
  const response = JSON.stringify({ message: "Hello" });
  res.send(response);
})
// protected route
router.get('/protected', passport.authenticate('jwt', { session: false }), function (req, res) {
  res.json('Success! You can now see this without a token.');
});

router.post('/api/agentCreate', authentication.encrypt, (req, res) => {
  Agent.create(req.body)
    .then(result => res.json(result));
})
router.post('/api/create', (req, res) => {
  Admin.create(req.body)
    .then(result => res.json(result));

})

const port = 3000
app.use(router)
app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`)
})
