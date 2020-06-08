/**
 * 整合所有子路由
 */

const router = new require('koa-router')()
const home = require('./home')
const share = require("./share")
const prize = require("./prize")


router.use('', home.routes())
router.use('/share', share.routes())
router.use('/prize', prize.routes())

module.exports = router