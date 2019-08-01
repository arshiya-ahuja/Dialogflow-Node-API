module.exports = (sequelize, type) => {
  return sequelize.define('Agent', {
    projectId: {
      type: type.STRING,
      primaryKey: true,
      autoIncrement: false,
      unique: true,
    },
      
      displayName:{
        type : type.STRING
      },
      email: {
        type: type.STRING(255),
        field: 'email',
        allowNull: false,
        unique: true
      },
      password: {
        type: type.STRING(255),
        field: 'password',
        allowNull: false
      },
      roletype: {
        type: type.STRING(255),
        field: 'roletype',
        allowNull: false
      },


  })

}