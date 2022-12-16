import  sequelize from '../database/connection';
const {Sequelize} = require('sequelize');

const Users = sequelize.define('user',{
    NAME:{
        type:Sequelize.DataTypes.STRING,
        allowNull:true,
        validate:{
            len:[3,40]
        },
    },
    PASSWORD:{
        type:Sequelize.DataTypes.STRING,
        allowNull:true,
    },
    AGE:{
        type:Sequelize.DataTypes.INTEGER,
        defaultValue:0,
    },
    EMAIL:{
        type:Sequelize.DataTypes.STRING,
        // unique:true,
        validate:{
            isEmail:{
                msg:'not valid email'
            }
        },
        unique: 'compositeIndex'
    },
    GENDER:{
        type:Sequelize.DataTypes.STRING,
        defaultValue:'',
    },
    USERROLEId:{
        type:Sequelize.DataTypes.INTEGER,
        defaultValue:2,
    },
    STATUS:{
        type:Sequelize.DataTypes.STRING,
        defaultValue:'pending',
    },
    PROFILE:{
        type:Sequelize.DataTypes.BLOB,
        allowNull:true
    }
},{
    timestamps:true,
    // paranoid:true,
    // tableName:'user',
    // freezeTableName:true,
});

export default Users;