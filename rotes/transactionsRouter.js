const Router = require('express')
const router = new Router()
const transactionController = require('../controllers/transactionController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/transfer', authMiddleware, transactionController.transferMoney)
router.post('/info', authMiddleware, transactionController.infoAbout)
router.post('/getBillTransactions', authMiddleware, transactionController.getBillTransactions)

module.exports = router