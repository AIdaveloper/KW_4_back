const {Type, Bill, User, Transaction} = require('../models/models')
const ApiError = require('../error/ApiError')
const {Op} = require('sequelize')

class TransactionController {
    async transferMoney(req, res, next) {
        const {billFrom, billTo, money} = req.body
        if (!billFrom || !billTo || !money){
            return next(ApiError.badRequest("Not all params. Required (billFrom, billTo, money)"))
        }
        const billFromTest = await Bill.findOne({where:{id:billFrom}})
        if (!billFromTest){
            return next(ApiError.badRequest(`Bill from not exist.[billForm ${billFrom}]`))
        }
        if (billFromTest.userId !== req.user.id){
            return next(ApiError.badRequest(`You dont have access ti this bill.[billForm ${billFrom}]`))
        }
        if (billFromTest.amountOfMoney < money){
            return next(ApiError.badRequest(`Not enough money`))
        }
        const billToTest = await Bill.findOne({where:{id:billTo}})
        if (!billToTest){
            return next(ApiError.badRequest(`Bill to not exist.[billTo ${billTo}]`))
        }
        const transaction = await Transaction.create({BillFromId:billFrom, BillToId:billTo, money:money})
        await billFromTest.decrement({'amountOfMoney': money})
        await billToTest.increment({'amountOfMoney':money})
        return res.json(transaction)
    }
    async getBillTransactions(req, res, next) {
        // console.log(req.body)
        const {billId} = req.body
        if (!billId){
            return next(ApiError.badRequest("No argument billId"))
        }
        const bill = await Bill.findOne({where:{id:billId}})
        if (!bill){
            return next(ApiError.badRequest("Bill is not exist"))
        }
        if (bill.userId !== req.user.id){
            return next(ApiError.badRequest(`You dont have access to this bill(${bill.userId} , ${req.user.id}) (${JSON.stringify(bill)})`))
        }
        const transactions =  await Transaction.findAll({where: {[Op.or]: [{BillFromId: billId}, {BillToId: billId}]}})
        return res.json(transactions)
    }
    async infoAbout(req, res, next) {
        const {transactionId} = req.body
        if (!transactionId){
            return next(ApiError.badRequest("No argument transactionId"))
        }
        const transaction = await Transaction.findOne({where:{id:transactionId}})
        if (!transaction){
            return next(ApiError.badRequest("Transaction is not exist"))
        }
        const bf = await Bill.findOne({where:{id:transaction.BillFrom}})
        const bt = await Bill.findOne({where:{id:transaction.BillTo}})

        if ((bf.userId !== req.user.id)||(bt.userId !== req.user.id)){
            return next(ApiError.badRequest("You dont have access to this transaction"))
        }
        return res.json(transaction)
    }
}

module.exports = new TransactionController()