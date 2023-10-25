const Router = require('express')
const router = new Router()

const userRouter = require('./userRouter')
const billRouter = require('./billRouter')
const cardRouter = require('./cardRouter')
const transactionRouter = require('./transactionsRouter')

// router.use('/',)
router.use('/user', userRouter)
router.use('/bill', billRouter)
router.use('/card', cardRouter)
router.use('/transactions', transactionRouter)


module.exports = router