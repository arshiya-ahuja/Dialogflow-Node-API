const Sequelize = require('sequelize')
const AgentModel = require('./models/Agent')
const IntentModel = require('./models/Intent')
const EntityTypeModel = require('./models/EntityType');
const EntityModel = require('./models/Entity')
const ContextModel = require('./models/Context')
const KnowledgeBaseModel = require('./models/KnowledgeBase')
const DocumentModel = require('./models/Document')
const AdminModel = require('./models/admins');



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

Admin.hasMany(Agent)


Agent.hasMany(Intent, {
    foreignKey: {
      name: 'projectId',
      allowNull: false
    }
  })
//   Agent.beforeCreate((Agent, options) => {

//     return bcrypt.hash(Agent.password, 10)
//         .then(hash => {
//             Agent.password = hash;
//         })
//         .catch(err => { 
//             throw new Error(); 
//         });
// });

// Agent.beforeCreate((Agent, options) => {

//   return bcrypt.hash(Agent.private_key, 10)
//       .then(hash => {
//           Agent.private_key= hash;
//       })
//       .catch(err => { 
//           throw new Error(); 
//       });
// });

// Agent.beforeCreate((Agent, options) => {

//   return bcrypt.hash(Agent.client_email, 10)
//       .then(hash => {
//           Agent.client_email = hash;
//       })
//       .catch(err => { 
//           throw new Error(); 
//       });
// });



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
