const Sequelize = require('sequelize')
const AgentModel = require('./models/Agent')
const IntentModel = require('./models/Intent')
const EntityTypeModel = require('./models/EntityType');
const EntityModel = require('./models/Entity')
const ContextModel = require('./models/Context')
const KnowledgeBaseModel = require('./models/KnowledgeBase')
const DocumentModel = require('./models/Document')
const AdminModel = require('./models/admins');
const crypto = require('crypto');
const authentication = require('../routes/auth')



//check username and password 
const sequelize = new Sequelize('DialogFlowAPI', 'root', 'Arshiya2004', { 
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

const Agent = AgentModel(sequelize, Sequelize)
const Intent = IntentModel(sequelize, Sequelize)
const EntityType = EntityTypeModel(sequelize, Sequelize)
const Entity = EntityModel(sequelize, Sequelize)
const Context = ContextModel(sequelize, Sequelize)
const KnowledgeBase = KnowledgeBaseModel(sequelize, Sequelize)
const Document = DocumentModel(sequelize, Sequelize)
const Admin = AdminModel(sequelize,Sequelize);
Agent.beforeCreate((Agent, options) => {

  return authentication.encrpt(req.body.password, 10)
      .then(hash => {
          Agent.password = hash;
      })
      .catch(err => { 
          throw new Error(); 
      });
});
// Agent.generateSalt = function() {
//   return crypto.randomBytes(16).toString('base64')
// }
// User.encryptPassword = function(plainText, salt) {
//   return crypto
//       .createHash('RSA-SHA256')
//       .update(plainText)
//       .update(salt)
//       .digest('hex')
// }

// const setSaltAndPassword = Agent => {
//   if (Agent.changed('password')) {
//       Agent.salt = Agent.generateSalt()
//       Agent.password = Agent.encryptPassword(Agent.password(), Agent.salt())
//   }
// }


// Agent.beforeCreate(setSaltAndPassword)
// Agent.beforeUpdate(setSaltAndPassword)

// Agent.prototype.correctPassword = function(enteredPassword) {
//   return Agent.encryptPassword(enteredPassword, this.salt()) === this.password()
// }


Agent.hasMany(Intent, {
    foreignKey: {
      name: 'projectId',
      allowNull: false
    }
  })

  Agent.hasMany(Entity, {
    foreignKey: {
      name: 'projectId',
      allowNull: false
    }
  })

  Agent.hasMany(Context, {
    foreignKey: {
      name: 'projectId',
      allowNull: false
    }
  })

  Agent.hasMany(EntityType, {
    foreignKey: {
      name: 'projectId',
      allowNull: false
    }
  })
  Agent.hasMany(Entity, {
    foreignKey: {
      name: 'projectId',
      allowNull: false
    }
  })
  EntityType.hasMany(Entity, {
    foreignKey: {
      name: 'entityTypeId',
      allowNull: false
    }
  })
  Agent.hasMany(KnowledgeBase, {
    foreignKey: {
      name: 'projectId',
      allowNull: false
    }
  })

  KnowledgeBase.hasMany(Document, {
    foreignKey: {
      name: 'knowledgeBaseId',
      allowNull: false
    }
  })

  

sequelize.sync()
  .then(() => {
    console.log('Database & tables created!')
  })

module.exports = {
  Agent,
  Intent,
  EntityType,
  Entity,
  Context,
  KnowledgeBase,
  Document,
  // DetectIntent,
  Admin
}
