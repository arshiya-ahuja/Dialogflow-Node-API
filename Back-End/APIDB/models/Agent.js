

module.exports = (sequelize, type) => {
    return sequelize.define('Agent', {
      projectId: {
        type: type.STRING,
        primaryKey: true,
      },
        
        displayName:{
          type : type.STRING
        },
        email: {
          type: type.STRING(255),
          field: 'email',
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true, 
            notEmpty: true,
            len: [8, 255]
        },
      },
        password: {
          type: type.STRING(255),
          field: 'password',
          allowNull: false,
          validate: {
            len: {
                args: 8,
                msg: "Name must be atleast 3 characters in length"
            },
          },
        },
        roletype: {
          type: type.STRING(255),
          field: 'roletype',
          allowNull: false
        },

        private_key: {
        type: type.TEXT,
        field: 'private_key',
        allowNull: false
        },

        client_email: {
          type: type.STRING(255),
          field: 'client_email',
          allowNull: false
        }
    })

}