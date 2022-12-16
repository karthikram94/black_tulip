const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('bulp', 'root', 'Mysqluser@123', {
    dialect: 'mysql',
    host:'localhost',
    operatorsAliases: 0,
    logging:console.log
});

sequelize.authenticate().then(() => {
	console.log('Connection has been established successfully to database - bulp' );
}).catch((err) => {
	console.error('Unable to connect to the database - bulp: ', err);
});

export default sequelize;