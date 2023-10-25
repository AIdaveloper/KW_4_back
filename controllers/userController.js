const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const {User, Transaction, Card, Bill} = require('../models/models')

const generateJWT = (id, email) => {
    return jwt.sign({id, email}, process.env.SECRET_KEY, {expiresIn: '24h'})

}
class UserController {
    async registration(req, res, next) {
        const {email, password, passport, name, role} = req.body
        console.log(req.body)
        if (!email || !password || !passport || !name){
            return next(ApiError.badRequest('Incorrect email, password, name or passport'))
        }
        if (passport.length<10){
            return next(ApiError.badRequest('Wrong passport format'))
        }
        const candidate = await User.findOne({where:{email}})
        if (candidate){
            return next(ApiError.badRequest('User already exist (email)'))
        }
        const candidateP = await User.findOne({where:{passport}})
        if (candidateP){
            return next(ApiError.badRequest('User already exist (passport)'))
        }

        const hasPassword = await bcrypt.hash(password, 8)
        const user = await User.create({name:name, email:email, password:hasPassword, passport:passport})
        const token = generateJWT(user.id, name)
        return res.json({token})
    }
    async login(req, res, next) {
        const {email, password} = req.body
        console.log(req.body)
        const user = await User.findOne({where: {email:email}})
        if (!user){
            return next(ApiError.internal('User not found'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword){
            return next(ApiError.internal('Wrong password'))
        }
        const token = generateJWT(user.id, user.name)
        return res.json({token})
    }
    async doseAuth(req, res, next) {
        const token = generateJWT(req.user.id, req.user.name)

        return res.json({token})
    }
}

module.exports = new UserController()