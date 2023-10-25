const Router = require('express')
const router = new Router()
const cardController = require('../controllers/cardController')
const authMiddleware = require('../middleware/authMiddleware')

// router.get('/', )
router.post('/card', authMiddleware, cardController.get)
router.post('/setLimit', authMiddleware, cardController.setLimit)
router.post('/delete', authMiddleware, cardController.delete)
router.post('/myCards', authMiddleware, cardController.getAll)
router.post('/newCard', authMiddleware, cardController.create)

module.exports = router