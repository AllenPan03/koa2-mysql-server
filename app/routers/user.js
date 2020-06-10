/**
 * 用户相关路由
 */
const router = new require('koa-router')()
const { getUser, addUser } = require("../controllers/user")

router.get('/getUser', getUser)
router.post('/addUser', addUser)

module.exports = router