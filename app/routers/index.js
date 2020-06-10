/**
 * 整合所有子路由
 */

const router = new require('koa-router')()
const home = require('./home')
const user = require("./user")


router.use('', home.routes())
router.use('/user', user.routes())

module.exports = router