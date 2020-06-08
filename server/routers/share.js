const router = new (require("koa-router"))()
const { getShareCfg } = require("../controllers/share")

router.get('/getShareCfg', getShareCfg)

module.exports = router