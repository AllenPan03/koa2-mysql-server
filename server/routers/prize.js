const router = new (require("koa-router"))()
const { getPrize, getUser } = require("../controllers/prize")

router.get('/getPrize', getPrize)
router.get('/getUser', getUser)

module.exports = router