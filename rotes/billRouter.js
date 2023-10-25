const Router = require('express')
const router = new Router()
const billController = require('../controllers/billController')
const authMiddleware = require('../middleware/authMiddleware')

// router.get('/', )
router.post('/bill', authMiddleware, billController.get)
router.post('/delete', authMiddleware, billController.delete)
router.post('/fill', authMiddleware, billController.fill)
router.post('/userBills', authMiddleware, billController.getUserBills)
router.post('/myBills', authMiddleware, billController.getAll)
router.post('/newBill', authMiddleware, billController.create)

module.exports = router