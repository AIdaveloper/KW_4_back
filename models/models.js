const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name : {type: DataTypes.STRING, allowNull: false},
    email : {type: DataTypes.STRING, allowNull: false},
    password : {type: DataTypes.STRING, allowNull: false},
    passport : {type: DataTypes.STRING(10), allowNull: false},
    number : {type: DataTypes.INTEGER}
})

const Card = sequelize.define('card', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
// card_number : {type: DataTypes.INTEGER, unique: true, allowNull: false},
    limit : {type: DataTypes.INTEGER, allowNull: false}
})

const Bill = sequelize.define('bill', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    amountOfMoney : {type: DataTypes.INTEGER, allowNull: false}
})

const Transaction = sequelize.define('transaction', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    // BillFromId : {type: DataTypes.INTEGER, allowNull: false},
    // BillToId : {type: DataTypes.INTEGER, allowNull: false},
    money : {type: DataTypes.INTEGER, allowNull: false}
})

const TransactionType = sequelize.define('transactionType', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    // amountOfMoney : {type: DataTypes.INTEGER, allowNull: false},
    // amountOfMoney : {type: DataTypes.INTEGER, allowNull: false},
    Name : {type: DataTypes.STRING, allowNull: false}
})

User.hasMany(Bill)
Bill.belongsTo(User)

User.hasMany(Card)
Card.belongsTo(User)

Bill.hasMany(Card)
Card.belongsTo(Bill)

// Transaction.hasOne(TransactionType)
// TransactionType.belongsTo(Transaction)

Bill.hasMany(Transaction)
Transaction.belongsTo(Bill, {as:'BillFrom', foreignKeyConstraint:Bill })

// Bill.hasMany(Transaction)
Transaction.belongsTo(Bill, {as:'BillTo', foreignKeyConstraint:Bill})
// asd


module.exports = {
    User,
    Card,
    Bill,
    Transaction,
    // TransactionType
}