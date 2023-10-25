const {Bill, Card} = require("../models/models");
const ApiError = require("../error/ApiError");

class CardController {
    async getAll(req, res) {
        const cards = await Card.findAll({where:{userId:req.user.id}})
        return res.json(cards)
    }
    async get(req, res, next) {
        console.log(req.body)
        const {cardId} = req.body
        if (!cardId){
            return next(ApiError.badRequest('No params cardId'))
        }
        const card = await Card.findOne({where:{id:cardId}})
        if (!card){
            return next(ApiError.badRequest('Card not exist'))
        }
        if (card.userId != req.user.id){
            return next(ApiError.badRequest('You dont have access to this card'))
        }
        return res.json(card)
    }
    async delete(req, res, next) {
        const {cardId} = req.body
        if (!cardId){
            return next(ApiError.badRequest('No params cardId'))
        }
        const card = await Card.findOne({where:{id:cardId}})
        if (!card){
            return next(ApiError.badRequest('Card not exist'))
        }
        if (card.userId != req.user.id){
            return next(ApiError.badRequest('You dont have access to this card'))
        }
        card.destroy()
        return res.json(card)
    }
    async setLimit(req, res, next) {
        const {cardId, limit} = req.body
        if (!cardId || !limit){
            return next(ApiError.badRequest('No params cardId, limit'))
        }
        const card = await Card.findOne({where:{id:cardId}})
        if (!card){
            return next(ApiError.badRequest('Card not exist'))
        }
        if (card.userId != req.user.id){
            return next(ApiError.badRequest('You dont have access to this card'))
        }
        if (limit<0){
            return next(ApiError.badRequest('limit cannot be les then 0'))
        }
        if (typeof limit !== 'number'){
            return next(ApiError.badRequest('limit nave to be number'))
        }
        card.update({"limit":limit})
        return res.json(card)
    }




    // async moveMoney(req, res) {
    //
    // }
    async create(req, res, next) {

        const {billId, limit } = req.body
        if (!billId && !limit){
            return next(ApiError.badRequest('Not enough params. This method requires billId and limit'))
        }
        if (!billId){
            return next(ApiError.badRequest('No bill id'))
        }
        if (!limit){
            return next(ApiError.badRequest('No limit'))
        }
        const billTest = await Bill.findOne({where:billId})
        if (!billTest){
            return next(ApiError.badRequest('Bill not exist'))
        }
        console.log(`billId ${billId}`)
        console.log(billTest)
        if (billTest.userId != req.user.id){
            return next(ApiError.badRequest('You dont have access to this bill'))
        }
        const card = await Card.create({limit:limit, userId:req.user.id, billId:billId} )
        console.log(card)
        return res.json(card)
    }
}

module.exports = new CardController()