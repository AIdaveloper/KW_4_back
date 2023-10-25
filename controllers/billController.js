const {Bill, User} = require('../models/models')
const ApiError = require("../error/ApiError");

class BillController {
    async getAll(req, res) {
        const bills = await Bill.findAll({where:{userId:req.user.id}})
        return res.json(bills)
    }
    async get(req, res, next) {
        const {billId} = req.body
        if (!billId){
            return next(ApiError.badRequest('No params billId'))
        }
        const bill = await Bill.findOne({where:{id:billId}})
        if (!bill){
            return next(ApiError.badRequest('Bill not exist'))
        }
        if (bill.userId != req.user.id){
            return next(ApiError.badRequest('You dont have access to this bill'))
        }
        return res.json(bill)
    }
    async delete(req, res, next) {
        const {billId} = req.body
        if (!billId){
            return next(ApiError.badRequest('No params billId'))
        }
        const bill = await Bill.findOne({where:{id:billId}})
        if (!bill){
            return next(ApiError.badRequest('Bill not exist'))
        }
        if (bill.userId != req.user.id){
            return next(ApiError.badRequest('You dont have access to this bill'))
        }
        bill.destroy()
        return res.json(bill)
    }
    async fill(req, res, next) {
        const {billId, money} = req.body
        if (!billId || !money){
            return next(ApiError.badRequest('No params billId, money'))
        }
        if (typeof money !== 'number'){
            return next(ApiError.badRequest('money not a number'))
        }
        const bill = await Bill.findOne({where:{id:billId}})
        if (!bill){
            return next(ApiError.badRequest('Bill not exist'))
        }
        if (bill.userId != req.user.id){
            return next(ApiError.badRequest('You dont have access to this bill'))
        }
        bill.increment({
            'amountOfMoney':money
        })
        return res.json(bill)
    }
    async getUserBills(req, res, next) {
        const {userEmail} = req.body
        if (!userEmail){
            return next(ApiError.badRequest('No params userEmail'))
        }
        const user = await User.findOne({where:{email:userEmail}})
        if (!user){
            return next(ApiError.badRequest('User not exist'))
        }
        const bills = await Bill.findAll({where:{userId:user.id}, attributes:["id"]})
        return res.json(bills)
    }

    // async moveMoney(req, res) {
    //
    // }
    async create(req, res) {

        // console.log(req.user.id)
        const bill = await Bill.create({amountOfMoney:0, userId:req.user.id} )
        console.log(bill)
        return res.json(bill)
    }
}

module.exports = new BillController()