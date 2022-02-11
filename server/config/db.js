const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize('OTP-Auth', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

sequelize.authenticate()
    .then(() => console.log('connected to database'))
    .catch((err) => console.log(err))

const db = {}
db.sequelize = sequelize;
db.sequelize.sync({force: false})
    .then(() => console.log('sync'))
    .catch(() => console.log('not synced'))

db.user = require('../models/userModel')(sequelize, DataTypes)


module.exports = db;